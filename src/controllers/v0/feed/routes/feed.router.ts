import { Router, Request, Response } from "express";
import { FeedItem } from "../models/FeedItem";
import { requireAuth } from "../../users/routes/auth.router";
import * as AWS from "../../../../aws";

const router: Router = Router();

// Get all feed items
router.get("/", async (req: Request, res: Response) => {
  const items = await FeedItem.findAndCountAll({ order: [["id", "DESC"]] });
  items.rows.map((item) => {
    if (item.url) {
      item.url = AWS.getGetSignedUrl(item.url);
    }
  });
  res.send(items);
});

//@TODO -  Done
//Add an endpoint to GET a specific resource by Primary Key
router.get("/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  // get all items
  const items = await FeedItem.findAndCountAll({ order: [["id", "DESC"]] });

  // filter through the items for that specific id
  const found_item = items.rows.filter((item) => item.id == parseInt(id));

  // check if there was any feed item found
  if (found_item.length == 0) {
    return res.status(404).send(`Item with id:${id}, not found.`);
  }
  return res.status(200).send(found_item);
});

// update a specific resource
router.patch("/:id", requireAuth, async (req: Request, res: Response) => {
  let { id } = req.params;
  let my_caption = req.body.caption
  let my_url = req.body.url

  let found_item = await FeedItem.findOne({ where: { id: id } });
  if (!found_item) {
    return res.status(404).send(`Item with id:${id} not found.`);
  }
  else if(!my_caption || !my_url){
    return res.status(403).send(`Caption or url cannot be empty`)
  }
  await FeedItem.update(
    {
      caption: my_caption,
      url: my_url,

    },
    { where: { id: id } }
  )
  my_url = AWS.getGetSignedUrl(my_url)
  return res.status(201).send(`Item with id ${id} updated successfully\nSigned-Url:${my_url}`)
});

// Get a signed url to put a new item in the bucket
router.get(
  "/signed-url/:fileName",
  requireAuth,
  async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({ url: url });
  }
);

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post("/", requireAuth, async (req: Request, res: Response) => {
  const caption = req.body.caption;
  const fileName = req.body.url;

  // check Caption is valid
  if (!caption) {
    return res
      .status(400)
      .send({ message: "Caption is required or malformed" });
  }

  // check Filename is valid
  if (!fileName) {
    return res.status(400).send({ message: "File url is required" });
  }

  const item = await new FeedItem({
    caption: caption,
    url: fileName,
  });

  const saved_item = await item.save();

  saved_item.url = AWS.getGetSignedUrl(saved_item.url);
  res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;
