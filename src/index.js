import React, { useState } from "react";
import ReactDOM from "react-dom";

const Header = ({ title }) => {
  return <h1>{title}</h1>;
};
const Columns = ({ children }) => {
  return <div className="flex">{children}</div>;
};

const Column = ({ children, size }) => {
  var width = "w-" + size + "/12";
  return <div className={"border border-gray-400 " + width}>{children}</div>;
};

const Repeater = ({ template, data }) => {
  return data.map((item, itemIndex) => {
    var rec = React.createElement(template, { data: item, index: itemIndex });
    return rec;
  });
};

const Section = ({ children }) => {
  return <div className="p-2">{children}</div>;
};

const HorizontalStack = ({ children }) => {
  return <div className="flex flex-row gap-2">{children}</div>;
};

const VerticalStack = ({ children }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

const Card = ({ data, index }) => {
  return (
    <div className="inline-block border-solid border border-gray-600 w-28 m-2">
      <img src="https://placehold.co/600x400/EEE/31343C" className="w-full" />
      <div className="mb-2 p-2">{data.name}</div>
      <div className="text-right p-2">
        <button class="bg-blue-200 px-3 py-1 border border-blue-400">
          Buy
        </button>
      </div>
    </div>
  );
};
const App = () => {
  var items = [
    { name: "Shirt", price: 20.11 },
    { name: "Shoes", price: 4.43 },
    { name: "Pants", price: 7.83 }
  ];
  return (
    <Section>
      <Header title="My header" />
      <hr />
      <Columns>
        <Column size="4">Col 1</Column>
        <Column size="4">Col 2</Column>
        <Column size="4">Col 3</Column>
      </Columns>
      <hr />
      <HorizontalStack>
        <Repeater template={Card} data={items} />
      </HorizontalStack>
      <hr />
      <VerticalStack>
        <Repeater template={Card} data={items} />
      </VerticalStack>
      <hr />
      <Table
        cols={[
          { name: "Name", field: "name" },
          { name: "Price", field: "price" },
          {
            name: "action",
            align: "center",
            render: (data) => {
              return (
                <a
                  href="#"
                  onClick={() => {
                    console.log(data);
                  }}
                >
                  Delete
                </a>
              );
            }
          }
        ]}
        data={items}
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

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
