import { gsap } from "gsap";
import { map, lerp, clamp, getMousePos } from "./utils";
const images = Object.entries(require("../images/girls/*.jpg"));

let mousePos = { x: 0, y: 0 };
let mousePosCache = mousePos;
let direction = { x: mousePosCache.x - mousePos.x, y: mousePosCache.y - mousePos.y };

window.addEventListener("mousemove", (e) => (mousePos = getMousePos(e)));

export default class MenuItem {
	constructor(el, menuItemIndex, animatableProps) {
		this.DOM = { el };
		this.DOM.innerText = this.DOM.el.querySelector(".menu__item-innertext");
		this.menuItemIndex = menuItemIndex;
		this.animatableProps = animatableProps;

		this.layout();
		this.initEvents();
	}
	layout() {
		this.DOM.card = document.createElement("div");
		this.DOM.card.className = "image-card";
		this.DOM.cardInner = document.createElement("div");
		this.DOM.cardInner.className = "image-card__inner";
		this.DOM.cardImage = document.createElement("div");
		this.DOM.cardImage.className = "image-card__img";
		this.DOM.cardImage.style.backgroundImage = `url(${images[this.menuItemIndex][1]})`;

		this.DOM.cardInner.appendChild(this.DOM.cardImage);
		this.DOM.card.appendChild(this.DOM.cardInner);
		this.DOM.el.appendChild(this.DOM.card);
	}
	initEvents() {
		const onMouseEnter = () => {
			this.showImage();
			this.firstRAFCycle = true;
			this.renderLoop();
		};
		const onMouseLeave = () => {
			this.stopRender();
			this.hideImage();
		};
		this.DOM.el.addEventListener("mouseenter", onMouseEnter);
		this.DOM.el.addEventListener("mouseleave", onMouseLeave);
	}
	calcBounds() {
		this.bounds = {
			el: this.DOM.el.getBoundingClientRect(),
			card: this.DOM.card.getBoundingClientRect(),
			cardImage: this.DOM.cardImage.getBoundingClientRect(),
		};
	}
	showImage() {
		gsap.killTweensOf(this.DOM.cardInner);
		gsap.killTweensOf(this.DOM.cardImage);
		gsap.timeline({
			onStart: () => {
				this.DOM.el.style.zIndex = images.length;
			},
		})
			.to(this.DOM.cardInner, {
				duration: 0.8,
				ease: "elastic.out(1, 0.75)",
				transformOrigin: `50% ${direction.y < 0 ? "-20%" : "120%"}`,
				startAt: { rotation: `${direction.x < 0 ? "+" : "-"}25deg` },
				rotation: 0,
			})
			.to(
				this.DOM.cardImage,
				{
					duration: 0.2,
					ease: "Sine.easeOut",
					startAt: { opacity: 0, scale: 0.6 },
					opacity: 1,
					scale: 1,
				},
				0
			);
	}
	hideImage() {
		gsap.killTweensOf(this.DOM.cardInner);
		gsap.killTweensOf(this.DOM.cardImage);
		gsap.timeline({
			onStart: () => {
				this.DOM.el.style.zIndex = 1;
			},
		})
			.to(this.DOM.cardInner, {
				duration: 0.8,
				ease: "elastic.out(1, 0.75)",
				transformOrigin: `50% ${direction.y < 0 ? "-20%" : "120%"}`,
				rotation: `${direction.x < 0 ? "+" : "-"}25deg`,
			})
			.to(
				this.DOM.cardImage,
				{
					duration: 0.2,
					ease: "Sine.easeOut",
					opacity: 0,
					scale: 0.6,
				},
				0
			);
	}
	renderLoop() {
		if (!this.requestId) {
			this.requestId = requestAnimationFrame(() => this.render());
		}
	}
	stopRender() {
		if (this.requestId) {
			window.cancelAnimationFrame(this.requestId);
			this.requestId = undefined;
		}
	}
	render() {
		this.requestId = undefined;
		if (this.firstRAFCycle) {
			this.calcBounds();
		}

		this.updateAnimatableProps();

		direction = { x: mousePosCache.x - mousePos.x, y: mousePosCache.y - mousePos.y };
		mousePosCache = mousePos;

		gsap.set(this.DOM.card, {
			x: this.animatableProps.tx.previous,
			y: this.animatableProps.ty.previous,
			rotation: this.animatableProps.rotation.previous,
			skewX: this.animatableProps.skewx.previous,
			filter: `brightness(${this.animatableProps.brightness.previous}) saturate(${this.animatableProps.saturation.previous})`,
		});

		this.firstRAFCycle = false;
		this.renderLoop();
	}

	updateAnimatableProps() {
		const mouseDistanceX = clamp(Math.abs(mousePosCache.x - mousePos.x), 0, 100);

		this.animatableProps.tx.current = Math.abs(mousePos.x - this.bounds.el.left) - this.bounds.card.width / 2;
		this.animatableProps.ty.current = Math.abs(mousePos.y - this.bounds.el.top) - this.bounds.card.height / 2;

		this.animatableProps.rotation.current = this.firstRAFCycle
			? 0
			: map(mouseDistanceX, 0, 100, 0, direction.x < 0 ? 30 : -30);
		this.animatableProps.skewx.current = this.firstRAFCycle
			? 0
			: map(mouseDistanceX, 0, 100, 1, direction.x < 0 ? -60 : 60);
		this.animatableProps.brightness.current = this.firstRAFCycle ? 1 : map(mouseDistanceX, 0, 100, 1, 10);
		this.animatableProps.saturation.current = this.firstRAFCycle ? 1 : map(mouseDistanceX, 0, 100, 1, 8);

		for (const key in this.animatableProps) {
			this.animatableProps[key].previous = this.firstRAFCycle
				? this.animatableProps[key].current
				: lerp(
						this.animatableProps[key].previous,
						this.animatableProps[key].current,
						this.animatableProps[key].amt
				  );
		}
	}
}
