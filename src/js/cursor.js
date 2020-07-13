import { gsap } from "gsap";
import { getMousePos } from "./utils";

export default class Cursor {
	constructor(el, duration) {
		this.el = el;
		this.duration = duration;
		this.el.style.opacity = 0;
		this.mousePosition = { x: 0, y: 0 };
		this.bounds = this.el.getBoundingClientRect();

		this.initEvents();
	}
	initEvents() {
		window.addEventListener("mousemove", (ev) => {
			this.mousePosition = getMousePos(ev);
			gsap.to(this.el, {
				duration: this.duration,
				opacity: 1,
				x: this.mousePosition.x - this.bounds.width / 2,
				y: this.mousePosition.y - this.bounds.height / 2,
			});
		});
	}
}
