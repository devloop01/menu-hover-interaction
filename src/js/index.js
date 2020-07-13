console.clear();

import LocomotiveScroll from "locomotive-scroll";
import Splitting from "splitting";

import Cursor from "./cursor";
import { preloader } from "./preloader";
import Menu from "./menu";

import "../css/style.scss";

preloader(".menu__item").then(() => {
	Splitting();
	const menuEl = document.querySelector(".menu");
	new LocomotiveScroll({ el: menuEl, smooth: true });
	new Cursor(document.querySelector(".cursor__small"), 0);
	new Cursor(document.querySelector(".cursor__large"), 0.4);
	new Menu(menuEl);
});
