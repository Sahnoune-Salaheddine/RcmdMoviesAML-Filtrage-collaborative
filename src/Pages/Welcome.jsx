import React from "react";
import { useEffect } from "react";

import Footer from "../componets/Footer/Footer";

import WelcomePageImage1 from "../images/WelcomePageImage1.png";
import WelcomePageImage2 from "../images/WelcomePageImage2.png";
import WelcomePageImage3 from "../images/WelcomePageImage3.png";
import WelcomePageImage4 from "../images/WelcomePageImage4.png";
import WelcomePageBanner from "../images/WelcomePageBanner.jpg";

import { Fade } from "react-reveal";
import { Link } from "react-router-dom";

function Welcome() {
  useEffect(() => {
    //alert("Ceci n'est PAS le vrai Netflix, n'entrez pas vos VRAIS IDENTIFIANTS")
    const image1 = WelcomePageImage1;
  }, []);

  return (
    <div>
      {/*Bienvenue Section*/}
      <div
        style={{
          background: `linear-gradient(0deg, hsl(0deg 0% 0% / 73%) 0%, hsl(0deg 0% 0% / 73%) 35%),url(${WelcomePageBanner})`,
        }}
        className="h-[32rem] w-full sm:h-[65vh] xl:h-[80vh] bg-slate-800 relative"
      >
        <div className="grid content-center justify-center h-full justify-items-center">
          <div className="w-10/12 text-center sm:w-11/12 md:w-40rem">
            <Fade duration={2000}>
              <h1 className="mb-3 text-3xl font-semibold text-center text-white sm:text-4xl md:text-6xl">
                Films et séries en illimité, et bien plus
              </h1>
              <h1 className="mb-4 text-xl text-center text-stone-400 font-light sm:text-2xl">
                À partir de 35 MAD. Annulable à tout moment.
              </h1>
              <h1 className="mb-2 text-center text-stone-400 font-light sm:text-xl sm:mb-8">
                Prêt à regarder ? Saisissez votre adresse e-mail pour vous abonner.
              </h1>
              <div>
                <input
                  placeholder="Adresse e-mail"
                  className="w-full p-2 py-3 rounded-sm sm:py-4 md:py-5 md:w-3/4"
                />
                <Link to={"/signup"}>
                  <button className="px-4 py-2 mt-3 font-medium text-white bg-red-700 rounded-sm sm:py-4 md:mt-0 md:pb-5 md:text-xl md:w-1/4">
                    Commencer
                  </button>
                </Link>
              </div>
            </Fade>
          </div>
        </div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(hsl(0deg 0% 0% / 0%), hsl(0deg 0% 0% / 38%), hsl(0deg 0% 7%))",
          }}
        ></div>
      </div>

      {/* Section 2 */}
      <section className="bg-black border-y-8 border-y-zinc-800">
        <Fade>
          <div className="flex justify-center md:py-8">
            <div className="lg:flex lg:items-center lg:w-9/12">
              <div>
                <h1 className="mt-2 mb-6 text-4xl font-semibold text-center text-white lg:mt-0 lg:text-left lg:ml-8 lg:text-5xl xl:text-6xl">
                  Profitez sur votre TV.
                </h1>
                <h1 className="m-4 text-center text-stone-400 font-light lg:text-left lg:ml-8 lg:text-2xl lg:w-9/12">
                  Regardez sur les téléviseurs intelligents, PlayStation, Xbox,
                  Chromecast, Apple TV, lecteurs Blu-ray et plus encore.
                </h1>
              </div>
              <div className="flex justify-center">
                <img className="" src={WelcomePageImage1} />
              </div>
            </div>
          </div>
        </Fade>
      </section>

      {/* Section 3 */}
      <section className="bg-black">
        <Fade>
          <div className="flex justify-center">
            <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:w-9/12">
              <div className="flex justify-center">
                <img className="" src={WelcomePageImage2} />
              </div>
              <div>
                <h1 className="mx-4 mt-4 mb-6 text-4xl font-semibold text-center text-white lg:mt-0 lg:text-left lg:ml-8 lg:text-5xl xl:text-6xl">
                  Téléchargez vos séries pour les regarder hors ligne.
                </h1>
                <h1 className="m-4 text-center text-stone-400 font-light lg:text-left lg:ml-8 lg:text-2xl lg:w-9/12">
                  Enregistrez vos favoris facilement et ayez toujours quelque
                  chose à regarder.
                </h1>
              </div>
            </div>
          </div>
        </Fade>
      </section>

      {/* Section 4 */}
      <section className="bg-black border-y-8 border-y-zinc-800">
        <Fade>
          <div className="flex justify-center md:py-8">
            <div className="lg:flex lg:items-center lg:w-9/12">
              <div>
                <h1 className="mt-4 mb-6 text-4xl font-semibold text-center text-white lg:mt-0 lg:text-left lg:ml-8 lg:text-5xl xl:text-6xl">
                  Regardez partout.
                </h1>
                <h1 className="m-4 text-center text-stone-400 font-light lg:text-left lg:ml-8 lg:text-2xl lg:w-9/12">
                  Diffusez des films et séries TV en illimité sur votre
                  téléphone, tablette, ordinateur portable et TV.
                </h1>
              </div>
              <div className="flex justify-center">
                <img className="" src={WelcomePageImage3} />
              </div>
            </div>
          </div>
        </Fade>
      </section>

      {/* Section 5 */}
      <section className="bg-black">
        <Fade>
          <div className="flex justify-center">
            <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:w-9/12">
              <div className="flex justify-center">
                <img className="" src={WelcomePageImage4} />
              </div>
              <div>
                <h1 className="mt-4 mb-6 text-4xl font-semibold text-center text-white lg:mt-0 lg:text-left lg:ml-8 lg:text-5xl xl:text-6xl">
                  Créez des profils pour les enfants.
                </h1>
                <h1 className="m-4 text-center text-stone-400 font-light lg:text-left lg:ml-8 lg:text-2xl lg:w-9/12">
                  Envoyez les enfants à l'aventure avec leurs personnages
                  préférés dans un espace conçu juste pour eux — inclus avec
                  votre abonnement.
                </h1>
              </div>
            </div>
          </div>
        </Fade>
      </section>

      {/* Section 6 */}
      <section></section>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
}

export default Welcome;
