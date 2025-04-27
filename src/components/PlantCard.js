import React, { useState } from "react";

function PlantCard({ plant, onUpdatePlant, onDeletePlant }) {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [price, setPrice] = useState(plant.price);

  function handleSoldOutToggle() {
    const updatedPlant = { ...plant, soldOut: !plant.soldOut };
    fetch("http://localhost:6001/plants/" + plant.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ soldOut: updatedPlant.soldOut }),
    })
      .then((r) => r.json())
      .then((data) => {
        onUpdatePlant(data);
      });
  }

  function handlePriceChange(e) {
    setPrice(e.target.value);
  }

  function handlePriceSubmit(e) {
    e.preventDefault();
    const updatedPlant = { ...plant, price: parseFloat(price) };
    fetch("http://localhost:6001/plants/" + plant.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price: updatedPlant.price }),
    })
      .then((r) => r.json())
      .then((data) => {
        onUpdatePlant(data);
        setIsEditingPrice(false);
      });
  }

  function handleDelete() {
    fetch("http://localhost:6001/plants/" + plant.id, {
      method: "DELETE",
    }).then(() => {
      onDeletePlant(plant.id);
    });
  }

  return (
    <li className="card" data-testid="plant-item">
      <img src={plant.image} alt={plant.name} />
      <h4>{plant.name}</h4>
      {isEditingPrice ? (
        <form onSubmit={handlePriceSubmit}>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={handlePriceChange}
            autoFocus
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditingPrice(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <p>
          Price: ${plant.price.toFixed(2)}{" "}
          <button onClick={() => setIsEditingPrice(true)}>Edit</button>
        </p>
      )}
      {plant.soldOut ? (
        <button onClick={handleSoldOutToggle}>Out of Stock</button>
      ) : (
        <button className="primary" onClick={handleSoldOutToggle}>
          In Stock
        </button>
      )}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default PlantCard;
