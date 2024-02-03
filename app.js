const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
mongoose.set("strictQuery", false);
const _ = require("lodash");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://admin-jad:Giveme500@cluster0.fqg3g2v.mongodb.net/todolistDB");

  const itemSchema = {
    name: String,
  };

  const Item = mongoose.model("Item", itemSchema);

  const item1 = new Item({
    name: "Welcome to the todolist",
  });
  const item2 = new Item({
    name: "Hit + to add tasks",
  });
  const item3 = new Item({
    name: "<-- click the checkbox to delete task",
  });
  const defaultItems = [item1, item2, item3];

  const listSchema = {
    name: String,
    items: [itemSchema],
  };

  const List = mongoose.model("List", listSchema);

  app.get("/", function (req, res) {
    main().catch((err) => console.log(err));
    async function main() {
      try {
        const findItems = await Item.find({});
        if (findItems.length === 0) {
          const dotoday = await Item.insertMany(defaultItems);
          console.log(dotoday);

          res.render("list", { listTitle: "Today", newListItems: findItems });
        } else {
          res.render("list", { listTitle: "Today", newListItems: findItems });
        }
      } catch (err) {
        console.log(err);
      }
    }
  });

  app.get("/:newList", function (req, res) {
    main();
    async function main() {
      const createList = _.capitalize(req.params.newList);

      List.findOne({ name: createList }).exec(async function (err, foundList) {
        if (!foundList) {
          const list = new List({
            name: createList,
            items: defaultItems,
          });
          await list.save();
          res.redirect("/" + createList);
        } else {
          res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
        }
      });
    }
  });

  app.post("/", function (req, res) {
    main();
    async function main() {
      const itemName = req.body.newItem;
      const listName = req.body.list;
      const enterItem = new Item({
        name: itemName,
      });
      if(listName === "Today"){
         await enterItem.save();
         res.redirect("/");
        }else{
          List.findOne({name: listName}).exec(async function (err, foundList){
            await foundList.items.push(enterItem);
            await foundList.save();
            res.redirect("/" + listName);
          })
        }
    }
  });

  app.post("/delete", (req, res) => {
    main();
    async function main() {
      const checked = req.body.checkbox;
      const listName = req.body.listName;

      if(listName === "Today"){
        await Item.deleteOne({ _id: checked });
      res.redirect("/");
      }else{
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checked}}}).exec(async function(foundList){
          res.redirect("/" + listName);
        })
      }

      
    }
  });

  app.get("/about", function (req, res) {
    res.render("about");
  });

  app.listen(3000, function () {
    console.log("Server started on port 3000");
  });
}
