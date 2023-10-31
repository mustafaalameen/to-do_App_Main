import ToggleMoon from "/images/icon-sun.svg";
import ToggleSun from "/images/icon-moon.svg";
import Cross from "/images/icon-cross.svg";
import { useEffect, useState, useRef } from "react";

// const todos = [
// 	{ id: 1, description: "Jog around the Park 3x", completed: true },
// 	{ id: 2, description: "10 minutes meditation", completed: false },
// 	{ id: 3, description: "Read for 1 hour", completed: true },
// 	{ id: 4, description: "Pick up groceries", completed: false },
// 	{ id: 5, description: "Complete FrontEnd mentor", completed: true },
// 	{ id: 6, description: "Complete FrontEnd", completed: true },
// ];

// console.log(todos);

function TodoApp() {
  const [islightMode, setLightMode] = useState(false);
  const [todoItems, setTodoItems] = useState(function () {
    const storedValue = localStorage.getItem("todos");
    return storedValue ? JSON.parse(storedValue) : [];
  });
  // let filteredItems;

  function handleSetLightMode() {
    setLightMode(!islightMode);
  }
  function handleAddItem(newTodo) {
    setTodoItems((todoItems) => [...todoItems, newTodo]);
  }
  function handleToggleItem(id) {
    setTodoItems((todoItems) =>
      todoItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }
  function handleDeleteItem(id) {
    setTodoItems((items) => items.filter((item) => item.id !== id));
  }
  function handleClearCompleted() {
    setTodoItems((items) => items.filter((item) => item.completed !== true));
  }

  useEffect(
    function () {
      localStorage.setItem("todos", JSON.stringify(todoItems));
    },
    [todoItems]
  );

  return (
    <body style={islightMode ? { backgroundColor: "hsl(0, 0%, 98%)" } : {}}>
      <Header
        islightMode={islightMode}
        onSetLightMode={handleSetLightMode}
        onAddItem={handleAddItem}
      />
      <MainArea>
        <TodoList
          islightMode={islightMode}
          todoItems={todoItems}
          onToggleItem={handleToggleItem}
          onDeleteItem={handleDeleteItem}
          onClearCompleted={handleClearCompleted}
        />
        <TodoFooter />
      </MainArea>
    </body>
  );
}

function Header({ islightMode, onSetLightMode, onAddItem }) {
  const [description, setDescription] = useState("");
  const inputEl = useRef(null);

  function handleSubmit(e) {
    e.preventDefault(); // prevent the browser engine from rerendering anytime a value is inside the form.

    const newTodo = {
      id: Date.now(),
      description: description,
      completed: false,
    };

    if (!description) return;

    onAddItem(newTodo);
    setDescription("");
  }
  useEffect(function () {
    inputEl.current.focus();
  }, []);

  useEffect(function () {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setDescription("");
    });
  }, [setDescription]);

  return (
    <header className={islightMode ? "header-lightMode" : undefined}>
      <div className="header-body">
        <div className="header-head">
          <h1>TODO</h1>
          <button onClick={onSetLightMode}>
            <img src={islightMode ? ToggleSun : ToggleMoon} alt="toggleModes" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* <input type="checkbox" style={{opacity: 1}}/> */}
          <input
            type="text"
            placeholder="Create a new todo..."
            style={
              islightMode
                ? {
                    backgroundColor: "hsl(0, 0%, 98%)",
                    color: "hsl(236, 9%, 61%)",
                  }
                : undefined
            }
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            ref={inputEl}
          />
        </form>
      </div>
    </header>
  );
}

function MainArea({ children }) {
  return <main>{children}</main>;
}

function TodoList({
  islightMode,
  todoItems,
  onToggleItem,
  onDeleteItem,
  onClearCompleted,
}) {
  const [filterBy, setFilterBy] = useState("All");
  let filteredItem;
  if (filterBy === "All") filteredItem = todoItems;

  if (filterBy === "Completed") {
    filteredItem = todoItems?.slice().filter((item) => item.completed === true);
  }

  if (filterBy === "Active") {
    filteredItem = todoItems
      ?.slice()
      .filter((item) => item.completed === false);
  }

  return (
    <div id="main-box">
      <div
        className="mainBody"
        style={islightMode ? { backgroundColor: "hsl(0, 0%, 98%)" } : {}}
      >
        <ul>
          {filteredItem.map((todo) => (
            <TodoItem
              todo={todo}
              key={todo.id}
              islightMode={islightMode}
              onToggleItem={onToggleItem}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </ul>

        <div className="selection">
          <p style={islightMode ? { color: "hsl(236, 9%, 61%)" } : {}}>
            {filteredItem.length} items left
          </p>
          <button onClick={onClearCompleted}>Clear Completed</button>
        </div>
      </div>
      <div
        className="bottom-btns"
        style={islightMode ? { backgroundColor: "hsl(0, 0%, 98%)" } : {}}
      >
        <button onClick={(e) => setFilterBy(e.target.innerText)}>All</button>
        <button onClick={(e) => setFilterBy(e.target.innerText)}>Active</button>
        <button onClick={(e) => setFilterBy(e.target.innerText)}>
          Completed
        </button>
      </div>
    </div>
  );
}

function TodoItem({ todo, islightMode, onToggleItem, onDeleteItem }) {
  const [isHover, setIsHover] = useState(false);
  return (
    <li
      onPointerEnter={() => setIsHover(!isHover)}
      onPointerLeave={() => setIsHover(!isHover)}
    >
      <input
        type="checkbox"
        value={todo.completed}
        onChange={() => onToggleItem(todo.id)}
      />
      <span className="mark"></span>
      <p
        className={islightMode ? "" : "todoItems"}
        style={todo.completed ? { textDecoration: "line-through" } : {}}
      >
        {todo.description}
      </p>
      {isHover && (
        <button onClick={() => onDeleteItem(todo.id)}>
          <img src={Cross} alt="cross" />
        </button>
      )}
    </li>
  );
}

function Button({ islightMode, children }) {
  return (
    <button style={islightMode ? { color: "hsl(236, 9%, 61%)" } : {}}>
      {children}
    </button>
  );
}

function TodoFooter() {
  return <p id="footer">Drag and drop to reorder list</p>;
}

export default TodoApp;
