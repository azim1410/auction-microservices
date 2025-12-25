import axios from "axios";

export const getServiceUrl = async (
  serviceName: string
): Promise<string | null> => {
  try {
    const res = await axios.get(
      `http://localhost:4000/services/${serviceName}`
    );
    const { address, port } = res.data;
    return `http://${address}:${port}`;
  } catch {
    return null;
  }
};
