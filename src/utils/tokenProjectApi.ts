import axios, { AxiosError } from "axios";

import { Message } from "@hecate-org/blingaton-types/build";
import { response } from "express";

class TokenProjectApi {
  private readonly token: string;
  private readonly BASE_URL = "https://api.token-project.eu";

  constructor() {
    this.token = process.env.APP_TOKEN!;
  }

  public async save(data: object): Promise<any> {
    const res = await axios.post(this.BASE_URL + "/ipfs/object/put", data, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        contentType: "application/json",
      },
    });

    console.log(res);
    return res;
  }
}

export default new TokenProjectApi();
