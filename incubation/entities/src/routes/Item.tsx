import { useLoaderData } from "react-router";

export function Item() {
  console.log("useLoaderData", useLoaderData());
  const {item} = useLoaderData()
  return <div>Item {item} Page</div>
}