import { v4 as uuid } from "uuid";

export const videosData = {
  videos: [
    {
      id: uuid(),
      url: "https://youtu.be/ZOc4iEahJ9I?si=RPzxLO0sS-zu7gGd",
      title: "About FalconAI",
      duration: 27, //in seconds
    },
    {
      id: uuid(),
      url: "https://youtu.be/RSl1m8rX20k?si=lCaVwMNXPwkE1qXt",
      title: "Creating Your Avatar",
      duration: 51,
    },
    {
      id: uuid(),
      url: "https://youtu.be/EIP1m4Lf2-8?si=oVY-wDW85NcjZZwt",
      title: "Creating a Class",
      duration: 42,
    },
    {
      id: uuid(),
      url: "https://youtu.be/i85dUqxiCrM?si=j3AlxH2XESaHi7X9",
      title: "Adding Students to the Class",
      duration: 39,
    },
    {
      id: uuid(),
      url: "https://youtu.be/ZxC340LvReQ?si=uhDqbmQIyobAM-Qp",
      title: "Types of Tasks",
      duration: 46,
    },
    {
      id: uuid(),
      url: "https://youtu.be/Wg7AOaqAYL0?si=NX3A41Nh7eioXiuq",
      title: "Creating a Bot",
      duration: 85,
    },
  ],
};
