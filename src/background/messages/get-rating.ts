import fetchAdapter from "@vespaiach/axios-fetch-adapter";
import axios from "axios";
import { load } from "cheerio";

import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const name = req.body.name;
  console.log("here");

  const requests = axios.create({
    baseURL: "https://www.ratemyprofessors.com",
    timeout: 1000,
    adapter: fetchAdapter
  });

  const response = await requests.get("/search/professors", {
    params: { q: name }
  });
  console.log(response.request);
  if (response.status !== 200) throw new Error("Request failed!");

  const $ = load(response.data);
  const href = $(`a[class^="TeacherCard__StyledTeacherCard"]`).html();
  console.log(response.data);
  console.log(href);

  //const message = await querySomeApi();

  res.send({
    href
  });
};

export default handler;
