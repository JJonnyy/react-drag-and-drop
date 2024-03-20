import React, {useEffect, useState} from "react";
import {DEFAULT_CARDS} from "./data.js";
import {BurnBarrel} from "./BurnBarrel.jsx";
import {Column} from "./Column.jsx";

export const Board = () => {
  const [cards, setCards] = useState([]);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() =>{
    hasChecked && localStorage.setItem("cards", JSON.stringify(cards));
  },[cards])

  useEffect(() => {
    const cardData = localStorage.getItem("cards");
    setCards(cardData ? JSON.parse(cardData) : DEFAULT_CARDS);
    setHasChecked(true)
  }, []);

  return (
    <div className="flex h-full w-full gap-3 overflow-auto p-12">
      <Column
        title="New tasks"
        column="new_tasks"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Important tasks"
        column="important"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress"
        column="doing"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-emerald-200"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards}/>
    </div>
  );
};


