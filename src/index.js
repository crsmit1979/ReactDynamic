import React, { useState } from "react";
import ReactDOM from "react-dom";
import { create } from "zustand";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";

const useStore = create((set, get) => ({
  items: [
    { name: "Shirt", price: 20.11 },
    { name: "Shoes", price: 4.43 },
    { name: "Pants", price: 7.83 }
  ]
}));

const Header = ({ title }) => {
  return <h1>{title}</h1>;
};
const Columns = ({ children, className }) => {
  return <div className={"flex " + className}>{children}</div>;
};

const Column = ({ children, size, className }) => {
  var width = size == "12" ? "w-full" : "w-" + size + "/12";
  return <div className={"" + width + " " + className}>{children}</div>;
};

const Repeater = ({ template, data }) => {
  return data.map((item, itemIndex) => {
    var rec = React.createElement(template, { data: item, index: itemIndex });
    return rec;
  });
};

function selectBackgroundColor(isActive, canDrop) {
  if (isActive) {
    return "darkgreen";
  } else if (canDrop) {
    return "darkkhaki";
  } else {
    return "white";
  }
}
const Section = ({ children, className, allowedDropEffect, id }) => {
  const [{ canDrop, isOver, item }, drop] = useDrop(
    () => ({
      accept: "element",
      drop: () => ({
        name: `${allowedDropEffect} Dustbin`,
        allowedDropEffect
      }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        item: monitor.getItem()
      })
    }),
    [allowedDropEffect]
  );
  const isCurrentItem = item && item.id === id;
  const isActive = canDrop && isOver && isCurrentItem;
  const backgroundColor = selectBackgroundColor(isActive, canDrop);
  return (
    <div
      className={className + " p-2"}
      ref={drop}
      style={{ ...style, backgroundColor }}
    >
      {isActive ? "Release to drop" : ""}
      {children}
    </div>
  );
};

const HorizontalStack = ({ children }) => {
  return <div className="flex flex-row gap-2">{children}</div>;
};

const VerticalStack = ({ children }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};
const Text = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};
const Card = ({ data, index }) => {
  return (
    <div className="inline-block border-solid border border-gray-600 w-28 m-2">
      <Image src="https://placehold.co/600x400/EEE/31343C" className="w-full" />
      <div className="mb-2 p-2">{data.name}</div>
      <div className="text-right p-2">
        <Button>Buy</Button>
      </div>
    </div>
  );
};

var components = [
  "Button",
  "Section",
  "Link",
  "Table",
  "Columns",
  "Column",
  "Header",
  "Divider",
  "Text",
  "HorizontalStack",
  "VerticalStack",
  "Repeater"
];

const renderComponents = (items) => {
  if (!items) return <div>no items</div>;
  var result = [];
  for (var x = 0; x < items.length; x++) {
    var item = items[x];
    var index = x;
    const { type, children, props } = item;
    var component = type;
    if (!components.includes(type)) {
      var obj = React.createElement("div", { ...props, key: index }, type);
      result.push(obj);
    } else {
      if (children && children.length > 0) {
        var obj3 = React.createElement(
          component,
          { ...props, key: index },
          renderComponents(children)
        );
        result.push(obj3);
      } else {
        var obj1 = React.createElement(component, { ...props, key: index });
        result.push(obj1);
      }
    }
  }
  return result;
};

const DocumentJson = () => {
  var jsonData = [
    {
      type: "Section",
      allowedDropEffect: "any",
      children: [
        {
          type: "Section",
          allowedDropEffect: "any",
          children: [
            {
              type: "Text",
              props: {},
              children: "this is a section"
            }
          ]
        },
        {
          type: "Header",
          title: "My header"
        },
        {
          type: "Divider"
        },
        {
          type: "Text",
          props: {},
          children: "This is some text"
        },
        {
          type: "Divider"
        },
        {
          type: "Columns",
          children: [
            {
              type: "Column",
              size: "4",
              children: "Col 1"
            },
            {
              type: "Column",
              size: "4",
              children: "Col 2"
            },
            {
              type: "Column",
              size: "4",
              children: "Col 3"
            }
          ]
        },
        {
          type: "Divider"
        },
        {
          type: "HorizontalStack",
          children: [
            {
              type: "Repeater",
              template: "Card",
              data: "store.items"
            }
          ]
        },
        {
          type: "Divider"
        },
        {
          type: "VerticalStack",
          children: [
            {
              type: "Repeater",
              template: "Card",
              data: "store.items"
            }
          ]
        },
        {
          type: "Divider"
        },
        {
          type: "Table",
          cols: [
            { name: "Name", field: "name" },
            { name: "Price", field: "price" },
            {
              name: "action",
              align: "center",
              render: {
                type: "Link",
                href: "#",
                onClick:
                  "() => {\n                alert(JSON.stringify(data));\n              }",
                children: "Delete"
              }
            }
          ],
          data: "store.items"
        }
      ]
    }
  ]; 
  var rec = renderComponents(jsonData);
  console.log(rec);
  return <div>json data: {rec}</div>;
};

const Document = () => {
  const store = useStore();
  return (
    <Section allowedDropEffect="any">
      <Section allowedDropEffect="any"> this is a section</Section>
      <Header title="My header" />
      <Divider />
      <Text>This is some text</Text>
      <Divider />
      <Columns>
        <Column size="4">Col 1</Column>
        <Column size="4">Col 2</Column>
        <Column size="4">Col 3</Column>
      </Columns>
      <Divider />
      <HorizontalStack>
        <Repeater template={Card} data={store.items} />
      </HorizontalStack>
      <Divider />
      <VerticalStack>
        <Repeater template={Card} data={store.items} />
      </VerticalStack>
      <Divider />
      <Table
        cols={[
          { name: "Name", field: "name" },
          { name: "Price", field: "price" },
          {
            name: "action",
            align: "center",
            render: (data) => {
              return (
                <Link
                  href="#"
                  onClick={() => {
                    alert(JSON.stringify(data));
                  }}
                >
                  Delete
                </Link>
              );
            }
          }
        ]}
        data={store.items}
      />
    </Section>
  );
};

const Table = ({ cols, data }) => {
  var colHeads = cols.map((col, colIndex) => {
    return (
      <td align={col.align ?? "left"} className="font-bold p-1">
        {col.name}
      </td>
    );
  });

  var rows = data.map((row, rowIndex) => {
    var colItems = cols.map((col, colIndex) => {
      var cell = row[col.field];
      if (col.render) {
        cell = col.render({ row, rowIndex, col, colIndex });
      }
      return (
        <td align={col.align ?? "left"} className="p-1">
          {cell}
        </td>
      );
    });
    return <tr>{colItems}</tr>;
  });
  return (
    <table width="100%" className="border-collapse border border-gray-700">
      <thead>
        <tr style={{ backgroundColor: "lightgray" }}>{colHeads}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};
const Divider = () => {
  return <hr />;
};

const style = {
  border: "1px dashed gray",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  marginRight: "1.5rem",
  marginBottom: "1.5rem",
  float: "left"
};

const Element = ({ label }) => {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: "element",
      item: { name: label },
      end(item, monitor) {
        const dropResult = monitor.getDropResult();
        if (item && dropResult) {
          let alertMessage = "";
          const isDropAllowed =
            dropResult.allowedDropEffect === "any" ||
            dropResult.allowedDropEffect === dropResult.dropEffect;
          if (isDropAllowed) {
            const isCopyAction = dropResult.dropEffect === "copy";
            const actionName = isCopyAction ? "copied" : "moved";
            alertMessage = `You ${actionName} ${item.name} into ${dropResult.name}!`;
          } else {
            alertMessage = `You cannot ${dropResult.dropEffect} an item into the ${dropResult.name}`;
          }
          alert(alertMessage);
        }
      },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1
      })
    }),
    [label]
  );

  return (
    <div ref={drag} style={{ ...style, opacity }}>
      {label}
    </div>
  );
};

const Button = ({ children, className }) => {
  return (
    <button
      className={
        "rounded-md bg-blue-200 px-3 py-1 border border-blue-400 " + className
      }
    >
      {children}
    </button>
  );
};
const Image = ({ src, className }) => {
  return <img src={src} className={className} />;
};
const Link = ({ children, ...rest }) => {
  return <a {...rest}>{children}</a>;
};

const Popup = ({ title, children, buttons, show }) => {
  return (
    <div
      id="myModal"
      className={
        "fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm " +
        (show ? "" : "hidden")
      }
    >
      <div className="bg-white border shadow-md border-neutral-400 divide-y divide-neutral-300">
        <div className="p-2 bg-neutral-300">
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <div className="p-2">{children}</div>
        <div className="flex bg-neutral-200 justify-end gap-2 p-2">
          {buttons?.map((item) => {
            return <Button onClick={item.onClick}>{item.caption}</Button>;
          })}
        </div>
      </div>
    </div>
  );
};
const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Section className={"bg-neutral-400"} allowedDropEffect="any">
        <Columns className="p-2 font-bold bg-gray-800 text-white">
          <Column size="12">Doc Designer</Column>
        </Columns>
        <Columns>
          <Column size="3" className="bg-neutral-200 p-1">
            <Element label="Section" allowedDropEffect="any" />
            <Element label="Table" allowedDropEffect="any" />
            <Element label="Columns" allowedDropEffect="any" />
            <Element label="Column" allowedDropEffect="any" />
          </Column>
          <Column size="9" className="bg-white p-1">
            <DocumentJson />
          </Column>
        </Columns>
        <Columns className="p-2 font-bold bg-gray-400 text-white">
          <Column size="12">Footer</Column>
        </Columns>
        <Popup
          title="Confirmation"
          show={false}
          buttons={[
            { caption: "OK", onClick: () => alert("OK") },
            { caption: "Cancel", onClick: () => alert("Cancel") }
          ]}
        >
          Are you sure you want to delete
        </Popup>
      </Section>
    </DndProvider>
  );
};
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
