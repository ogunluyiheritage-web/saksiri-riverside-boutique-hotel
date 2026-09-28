"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SaksiriConcierge from "./SaksiriConcierge";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "https://img1.wsimg.com/isteam/ip/a4df2e64-0f50-4270-863f-097dbe554de3/blob-76c47bc.png/:/cr=t:0%2Cl:14.98%25%2Cw:70.03%25%2Ch:70.03%25",
  "https://static.travelated.com/storage/hotels3/398/3981743/property/79239843187.webp?format=webp&mode=crop&scale=down&w=3840&webp.quality=75",
  "https://static.travelated.com/storage/hotels3/398/3981743/property/27667748412.webp?format=webp&mode=crop&scale=down&w=3840&webp.quality=75",
  "https://static.travelated.com/storage/hotels3/398/3981743/property/3492989606.webp?format=webp&mode=crop&scale=down&w=3840&webp.quality=75",
  "https://static.travelated.com/storage/hotels3/398/3981743/property/68187420041.webp?format=webp&mode=crop&scale=down&w=3840&webp.quality=75",
  "https://static.travelated.com/storage/hotels3/398/3981743/property/22653594556.webp?format=webp&mode=crop&scale=down&w=3840&webp.quality=75",
  "https://static.travelated.com/storage/hotels3/398/3981743/property/48235358870.webp?format=webp&mode=crop&scale=down&w=3840&webp.quality=75",
];

const scenes = [
  { no:"01", label:"ARRIVE", kicker:"NAM SONG RIVER · ARRIVAL", title:"Where the river slows.", copy:"Arrive at the edge of the Nam Song, where warm architecture, garden air and limestone horizons set the rhythm for the stay." },
  { no:"02", label:"BREATHE", kicker:"RIVERSIDE POOL · GOLDEN HOUR", title:"Let the afternoon linger.", copy:"Water, shade and mountain light turn an ordinary afternoon into something deliberately unhurried." },
  { no:"03", label:"STAY", kicker:"DELUXE ROOMS · PRIVATE BALCONIES", title:"Wake to another horizon.", copy:"Quiet rooms open toward the landscape, giving every morning a little more space and every evening a softer edge." },
  { no:"04", label:"PAUSE", kicker:"GARDEN TERRACE · STILLNESS", title:"A little further from time.", copy:"Step onto the terrace, lower the pace and let the river, trees and distant peaks do the talking." },
  { no:"05", label:"TASTE", kicker:"SAKSIRI DINING · MORNING TABLE", title:"Taste the morning.", copy:"Fresh flavours and slow breakfasts meet the first light of Vang Vieng beyond the table." },
  { no:"06", label:"EXPLORE", kicker:"VANG VIENG · LIMESTONE COUNTRY", title:"The mountains are waiting.", copy:"Leave the garden behind and follow the Nam Song into caves, valleys, viewpoints and the dramatic karst landscape of Laos." },
  { no:"07", label:"RETURN", kicker:"SAKSIRI RIVERSIDE · EVENING", title:"And come back to stillness.", copy:"When the day is done, return to warm light, quiet water and the familiar calm of Saksiri." },
];

export default function SaksiriCinematicHero() {
  const root = useRef<HTMLElement | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    if (!root.current || !stage.current) return;
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const panels = gsap.utils.toArray<HTMLElement>("[data-scene-panel]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-scene-copy]");
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");
      const counter = document.querySelector<HTMLElement>("[data-counter]");
      const progress = document.querySelector<HTMLElement>("[data-progress]");

      gsap.set(panels, { autoAlpha: 0, z: -180, scale: 1.08, rotationY: 5, rotationX: -1.2, transformPerspective: 1500 });
      gsap.set(panels[0], { autoAlpha: 1, z: 0, scale: 1.02, rotationY: 0, rotationX: 0 });
      gsap.set(cards, { autoAlpha: 0, y: 50, z: -20, filter: "blur(9px)" });
      gsap.set(cards[0], { autoAlpha: 1, y: 0, z: 0, filter: "blur(0px)" });
      gsap.set(words, { opacity: 0, y: 24, filter: "blur(7px)" });
      gsap.set(cards[0].querySelectorAll("[data-word]"), { opacity: 1, y: 0, filter: "blur(0px)" });

      if (reduce) {
        gsap.set(panels, { autoAlpha: 1, z: 0, scale: 1 });
        gsap.set(cards, { autoAlpha: 1, y: 0, z: 0, filter: "blur(0px)" });
        return;
      }

      const intro = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
      intro
        .to("[data-entry-mark]", { opacity: 0, y: -20, duration: .45 })
        .to("[data-entry-panel]", { opacity: 0, scale: 1.04, filter: "blur(8px)", duration: .9, ease: "power3.inOut" }, "<")
        .set("[data-entry-panel]", { display: "none" });

      const playEntry = () => {
        setEntered(true);
        requestAnimationFrame(() => intro.play());
      };
      window.addEventListener("saksiri:enter", playEntry as EventListener);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${scenes.length * 1250}`,
          pin: stage.current,
          scrub: 1.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      scenes.forEach((scene, i) => {
        if (i === 0) {
          tl.to(panels[0], { scale: 1.045, duration: 1, ease: "none" }, 0)
            .to(panels[0].querySelector("img"), { scale: 1.055, xPercent: -1, yPercent: -.6, duration: 1, ease: "none" }, 0);
          return;
        }
        const at = i;
        const prev = panels[i - 1];
        const current = panels[i];
        const prevCard = cards[i - 1];
        const currentCard = cards[i];
        const currentWords = currentCard.querySelectorAll("[data-word]");

        tl.to(progress, { scaleX: i / (scenes.length - 1), duration: .65, ease: "none" }, at)
          .to(counter, { yPercent: -110, duration: .12, ease: "power2.in" }, at)
          .set(counter, { textContent: scene.no, yPercent: 110 }, at + .12)
          .to(counter, { yPercent: 0, duration: .2, ease: "power2.out" }, at + .12)
          .to(prev, { autoAlpha: 0, z: 170, scale: 1.13, xPercent: -2.2, yPercent: -.8, rotationY: -5.5, rotationX: 1.5, duration: .72, ease: "power3.inOut" }, at)
          .fromTo(current,
            { autoAlpha: 1, z: -260, scale: 1.17, xPercent: 4, yPercent: 1.4, rotationY: 6, rotationX: -1.8 },
            { autoAlpha: 1, z: 0, scale: 1.035, xPercent: 0, yPercent: 0, rotationY: 0, rotationX: 0, duration: 1.08, ease: "power4.inOut" }, at + .05)
          .fromTo(current.querySelector("img"),
            { scale: 1.2, xPercent: 5, yPercent: 2, rotationY: 3.8 },
            { scale: 1.055, xPercent: 0, yPercent: 0, rotationY: 0, duration: 1.12, ease: "power4.out" }, at + .05)
          .to(prevCard, { autoAlpha: 0, y: -38, z: 20, filter: "blur(6px)", duration: .38, ease: "power3.in" }, at + .05)
          .fromTo(currentCard,
            { autoAlpha: 0, y: 52, z: -50, filter: "blur(9px)" },
            { autoAlpha: 1, y: 0, z: 0, filter: "blur(0px)", duration: .66, ease: "power4.out" }, at + .28)
          .fromTo(currentWords,
            { opacity: 0, y: 22, filter: "blur(7px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: .42, stagger: .035, ease: "power3.out" }, at + .44)
          .to(current, { scale: 1.045, duration: .7, ease: "none" }, at + .45);
      });

      const onPointer = (e: PointerEvent) => {
        if (window.innerWidth < 801) return;
        const x = (e.clientX / window.innerWidth - .5) * 2;
        const y = (e.clientY / window.innerHeight - .5) * 2;
        gsap.to("[data-scene-image]", { x: x * 9, y: y * 5, rotationY: x * 1.4, rotationX: -y * 1, duration: 1.2, ease: "power3.out", overwrite: true });
        gsap.to("[data-scene-card]", { x: -x * 4, y: -y * 2, rotationY: -x * .8, duration: 1.1, ease: "power3.out", overwrite: true });
      };
      const resetPointer = () => {
        gsap.to("[data-scene-image]", { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 1.2, ease: "power3.out" });
        gsap.to("[data-scene-card]", { x: 0, y: 0, rotationY: 0, duration: 1.1, ease: "power3.out" });
      };
      window.addEventListener("pointermove", onPointer);
      window.addEventListener("pointerleave", resetPointer);
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("resize", refresh);
      requestAnimationFrame(() => requestAnimationFrame(refresh));

      return () => {
        window.removeEventListener("saksiri:enter", playEntry as EventListener);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("pointerleave", resetPointer);
        window.removeEventListener("resize", refresh);
      };
    }, root);
    return () => ctx.revert();
  }, []);

  function enter() {
    window.dispatchEvent(new Event("saksiri:enter"));
  }

  return (
    <section ref={root} className="saksiri-v2" aria-label="Saksiri Riverside Boutique Hotel">
      <div className="saksiri-entry" data-entry-panel>
        <div className="saksiri-entry__grain" />
        <div className="saksiri-entry__content">
          <span data-entry-mark className="saksiri-entry__eyebrow">VANG VIENG · LAOS</span>
          <div className="saksiri-entry__mark" data-entry-mark>SAKSIRI</div>
          <p data-entry-mark>RIVERSIDE BOUTIQUE HOTEL</p>
          <button onClick={enter} data-entry-mark>ENTER EXPERIENCE <span>↗</span></button>
        </div>
      </div>

      <header className="saksiri-v2__nav">
        <a className="saksiri-v2__brand" href="#top"><b>SAKSIRI</b><small>RIVERSIDE BOUTIQUE HOTEL</small></a>
        <nav className={menuOpen ? "is-open" : ""}>
          <a href="#stay" onClick={() => setMenuOpen(false)}>STAY</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>EXPERIENCE</a>
          <a href="#dining" onClick={() => setMenuOpen(false)}>DINING</a>
          <a href="#explore" onClick={() => setMenuOpen(false)}>VANG VIENG</a>
          <a className="reserve" href="#booking" onClick={() => setMenuOpen(false)}>BOOK A STAY ↗</a>
        </nav>
        <button className={`saksiri-v2__menu ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen(v => !v)} aria-label="Menu"><i/><i/><i/></button>
      </header>

      <div ref={stage} className="saksiri-v2__stage" id="top">
        <div className="saksiri-v2__atmosphere" />
        <div className="saksiri-v2__scenes">
          {scenes.map((scene, i) => (
            <article className="saksiri-v2__panel" data-scene-panel key={scene.no}>
              <div className="saksiri-v2__image-depth" data-scene-image>
                <img src={images[i]} alt="" loading={i === 0 ? "eager" : "lazy"} decoding="async" />
              </div>
              <div className="saksiri-v2__light" />
            </article>
          ))}
        </div>

        <div className="saksiri-v2__hero-title">
          <span>SAKSIRI · NAM SONG RIVER</span>
          <h1>Where the<br/><em>river slows.</em></h1>
        </div>

        <div className="saksiri-v2__story">
          {scenes.map((scene) => (
            <div className="saksiri-v2__story-card" data-scene-copy data-scene-card key={scene.no}>
              <div className="saksiri-v2__story-glass">
                <span className="story-number">{scene.no} / 07 · {scene.label}</span>
                <span className="story-kicker">{scene.kicker}</span>
                <h2>{scene.title.split(" ").map((word, i, arr) => <span data-word key={`${scene.no}-${i}`}>{word}{i < arr.length - 1 ? " " : ""}</span>)}</h2>
                <p>{scene.copy}</p>
                <div className="story-line"><i/><b>SAKSIRI</b><i/></div>
              </div>
            </div>
          ))}
        </div>

        <div className="saksiri-v2__rail" aria-hidden="true"><span>01</span><i/><span>07</span></div>
        <div className="saksiri-v2__bottom"><span data-counter>01</span><div className="progress"><i data-progress/></div><span>SCROLL TO MOVE THROUGH SAKSIRI ↓</span></div>
        <div className="saksiri-v2__location">NAM SONG RIVER · VANG VIENG</div>
        <SaksiriConcierge />
      </div>

      <section id="booking" className="saksiri-v2__after">
        <span>SAKSIRI · VANG VIENG</span>
        <h2>Stay beside the Nam Song.</h2>
        <p>For availability, room rates and booking details, continue to the official Saksiri hotel site.</p>
        <a href="https://saksirihotel.com" target="_blank" rel="noreferrer">VISIT SAKSIRI ↗</a>
      </section>
    </section>
  );
}
