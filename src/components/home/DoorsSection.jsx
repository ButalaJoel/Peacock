import { IMG_WEATHER, INSPO_SCANDI_SAGE } from "../../data/images.js";
import { Arr } from "../icons/Icons.jsx";
import { useApp } from "../../context/useApp.js";

export default function DoorsSection() {
  const { nav, openProduct, weathershield } = useApp();
  return (
    <>
        <section className="doors" aria-label="Shop for the home or for site teams">
          <div className="doors-grid">
            <button className="doors-home" onClick={() => nav("bedroom-inspiration")}>
              <img src={INSPO_SCANDI_SAGE} alt="Sage bedroom with a wood bed, linen, and morning light" />
              <span className="doors-home-shade" aria-hidden="true" />
              <span className="doors-home-copy">
                <strong>For the home.</strong>
                <span>Find interior paints and colours that work with the light in every room.</span>
              </span>
            </button>
            <div className="doors-side">
              <button className="doors-trade" onClick={() => nav("industrial-coatings")}>
                <span>
                  <strong>For site teams.</strong>
                  <span className="doors-trade-copy">Specify exterior, industrial, and trade finishes built for the job.</span>
                </span>
                <span className="doors-trade-go">Industrial coatings <Arr /></span>
              </button>
              <button className="doors-tin" onClick={() => openProduct(weathershield)}>
                <img src={weathershield.img || IMG_WEATHER} alt="" />
                <span>
                  <strong>Weathershield Plus</strong>
                  <span>Grade 1 premium exterior matt for tropical weather.</span>
                </span>
              </button>
            </div>
          </div>
        </section>
    </>
  );
}
