import React from 'react';

export default function Button1() {
  // Define the clickMe function
  const clickMe = () => {
    const b1 = document.getElementById("clickM");
    if (b1) {
      b1.textContent = "Hello Guest";
    }
  };

  return (
    <div>
      {/* Use a button element */}
      <button id="clickM" onClick={clickMe}>Click me!!!!</button>
    </div>
  );
}
