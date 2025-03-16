import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

const inputFieldEl = document.getElementById("inputField");
const addButtonEl = document.getElementById("addButton");
const shoppingList = document.getElementById("cartList");

const firebaseConfig = {
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const shoppingListRef = ref(database, "shoppingList");

onValue(shoppingListRef, (snapshot) => {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingList();
    itemsArray.forEach((i) => {
      appendListItem(i);
    });
  } else {
    shoppingList.innerHTML = "No items here...yet";
  }
});

const clearInputField = () => {
  inputFieldEl.value = "";
};

const clearShoppingList = () => {
  shoppingList.innerHTML = "";
};

const appendListItem = (item) => {
  const itemID = item[0];
  const itemValue = item[1];
  const newItem = document.createElement("li");
  const selectedItem = ref(database, `shoppingList/${itemID}`);

  newItem.textContent = itemValue;
  shoppingList.append(newItem);

  newItem.addEventListener("click", () => {
    remove(selectedItem);
  });
};

addButtonEl.addEventListener("click", function () {
  const inputValue = inputFieldEl.value;
  if (inputValue === "") {
    alert("Please enter a value");
  } else {
    push(shoppingListRef, inputValue);

    clearInputField();
  }
});
