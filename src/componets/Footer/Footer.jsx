import React from "react";
import styles from "./styles.module.scss";

function Footer2() {
  return (
    <div className="bg-black p-2">
      <footer className={styles.footer}>
        <div className={styles.containerFooter}>
          <div className={styles.icons}></div>
          <ul className={styles.details}>
            <li>FAQ</li>
            <li>Centre d'aide</li>
            <li>Compte</li>
            <li>Confidentialité</li>
            <li>Mentions légales</li>
            <li>Conditions d'utilisation</li>
            <li>Nous contacter</li>
            <li>Informations légales</li>
            <li>Account</li>
            <li>Préférences de cookies</li>
            <li>Test de vitesse</li>
            <li>Recrutement</li>
            <li>Modes de lecture</li>
          </ul>
          <div className={styles.security}>
            <div>Français</div>
            <span>© 1997-2025 Netflix Maroc</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer2;
