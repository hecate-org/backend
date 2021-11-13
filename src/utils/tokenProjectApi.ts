import { Message } from "@hecate-org/blingaton-types/build";
import axios from "axios";

class TokenProjectApi {
  private readonly id: string;
  private readonly secret: string;
  private readonly token: string;
  private readonly BASE_URL = "https://api.testnet.token-project.eu";

  constructor() {
    this.id = process.env.APP_ID!;
    this.secret = process.env.APP_SECRET!;
    this.token = process.env.APP_TOKEN!
  }

  public async save(data: object): Promise<string> {
      const res = await axios.post(
        this.BASE_URL + "/ipfs/object/put",
        data,
        {
            headers: {
                Authorization: `Bearer: ${this.token}`,
                contentType: "application/json"
            }
        }
      );

      console.log(res)
    return "a"
  }
}

export default new TokenProjectApi();
