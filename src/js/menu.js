import { gsap } from "gsap";
import MenuItem from "./menuItem";

export default class Menu {
	constructor(el) {
		this.el = el;
		this.menuItems = this.el.querySelectorAll(".menu__item");

		this.animatableProperties = {
			tx: { previous: 0, current: 0, amt: 0.1 },
			ty: { previous: 0, current: 0, amt: 0.1 },
			rotation: { previous: 0, current: 0, amt: 0.08 },
			skewx: { previous: 0, current: 0, amt: 0.08 },
			brightness: { previous: 1, current: 1, amt: 0.08 },
			saturation: { previous: 0, current: 0, amt: 0.1 },
		};

		this.menuItemInstances = [];

		[...this.menuItems].forEach((item, pos) =>
			this.menuItemInstances.push(new MenuItem(item, pos, this.animatableProperties))
		);

		gsap.to(this.el, 0.1, { opacity: 1 });

		this.showMenuItems();
	}
	showMenuItems() {
		gsap.fromTo(
			this.menuItemInstances.map((item) => item.DOM.innerText),
			{
				rotation: (i) => (i % 2 == 0 ? 15 : -15),
			},
			{
				duration: 1.2,
				ease: "Expo.easeOut",
				transformOrigin: (i) => (i % 2 == 0 ? "left bottom" : "right bottom"),
				y: 0,
				rotation: 0,
				delay: (pos) => 0.15 + pos * 0.06,
			}
		);
	}
}
