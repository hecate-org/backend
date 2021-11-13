import { Message } from "@hecate-org/blingaton-types/build";
import axios from "axios";
import { response } from "express";

class TokenProjectApi {
  private readonly token: string;
  private readonly BASE_URL = "https://api.token-project.eu";

  constructor() {
    this.token = process.env.APP_TOKEN!;
  }

  public async save(data: object): Promise<any> {
    try {
      const res = await axios.post(this.BASE_URL + "/ipfs/object/put", data, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          contentType: "application/json",
        },
      });

      console.log(res);
      return res;
    } catch (error) {
    //   console.log(error?.response);
      return "failed";
    }
  }
}

export default new TokenProjectApi();
