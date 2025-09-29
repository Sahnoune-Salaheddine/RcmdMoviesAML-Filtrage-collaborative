import React, { useContext, useState } from "react";
import { updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../Firebase/FirebaseConfig";
import { AuthContext } from "../Context/UserContext";
import toast, { Toaster } from "react-hot-toast";

function useUpdateMylist() {
  const { User } = useContext(AuthContext);
  const [isMyListUpdates, setisMyListUpdates] = useState(false);

  function notify() {
    toast.success("  Film ajouté à Ma Liste  ");
  }
  function alertError(message) {
    toast.error(message);
  }

  const addToMyList = (movie) => {
    updateDoc(doc(db, "MyList", User.uid), { movies: arrayUnion(movie) })
      .then(() => {
        console.log("Données ajoutées à Ma Liste");
        notify();
        setisMyListUpdates(true);
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        alertError(error.message);
      });
  };

  const removeFromMyList = (movie) => {
    updateDoc(doc(db, "MyList", User.uid), { movies: arrayRemove(movie) })
      .then(() => {
        toast.success(" Film retiré de Ma Liste  ");
        setisMyListUpdates(true);
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  };

  const PopupMessage = (
    <Toaster
      toastOptions={{
        style: {
          padding: "1.5rem",
          backgroundColor: "#f4fff4",
          borderLeft: "6px solid lightgreen",
        },
      }}
    />
  );

  return { addToMyList, removeFromMyList, PopupMessage, isMyListUpdates };
}

export default useUpdateMylist;
