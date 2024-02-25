import { memo } from "react";
import "./index.css";

const Item = ({ data }) => (
  <article className="item">
    <h3 className="item__name">{data.product}</h3>
    <p className="item__brand">{data.brand}</p>
    <p className="item__price">{data.price}₽</p>
  </article>
);

export default memo(Item);
