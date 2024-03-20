import React, {useState} from "react";
import {DropIndicator} from "./DropIndicator";
import {Card} from "./Card";
import {AddCard} from "./AddCard";

export const Column = ({ title, headingColor, cards, column, setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  }
  const handleDragOver = (e) => {
    e.preventDefault();
    hightloghtIndicator(e);
    setActive(true);
  }
  const hightloghtIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = 1;
  }
  const  clearHighlights = (e) => {
    const indicators = e || getIndicators();

    indicators.forEach((el) => {
      el.style.opacity = 0;
    })
  }
  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = e.clientY - (box.top + DISTANCE_OFFSET);
      if(offset < 0 && offset > closest.offset){
        return { offset, element: child }
      }else{
        return closest;
      }
    },{
      offset: Number.NEGATIVE_INFINITY,
      element: indicators[indicators.length - 1 ],
    })
    return el
  }
  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`))
  }
  const handleDragLeave = () => {
    setActive(false);
    clearHighlights();
  }
  const handleDragEnd = (e) => {
    setActive(false);
    clearHighlights();

    const cardId = e.dataTransfer.getData("cardId");
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";
    if(before !== cardId){
      let copy = [...cards];

      let cardToTransfer = copy.find(el => el.id === cardId);

      if(!cardToTransfer) return

      cardToTransfer = {... cardToTransfer, column}
      copy = copy.filter(el => el.id !== cardId);


      const moveToBack = before === "-1";

      if(moveToBack){
        copy.push(cardToTransfer);
      }else {
        const insertAtIndex = copy.findIndex(el => el.id === before);
        if (insertAtIndex === undefined) return

        copy.splice(insertAtIndex, 0, cardToTransfer);
        console.log('copy', copy);
      }
      setCards(copy);
    }
  }

  const filteredCards = cards.filter((card) => card.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50": "bg-neutral-800/0"}`}>
        {filteredCards.map((card) => {
          return <Card key={card.id} {...card} handleDragStart={handleDragStart}/>
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards}/>
      </div>
    </div>
  );
};