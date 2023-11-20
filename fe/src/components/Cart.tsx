"use client";
import { APIRemoveProductInCart } from "@/services/Cart";
import { CartInterface, ProductBillDto } from "@/types/Cart";
import FormatMoney from "@/utils/FormatMoney";
import Toast from "@/utils/Toast";
import Link from "next/link";
import { rule } from "postcss";
import React from "react";
interface PropsCartInterface {
  prop: any;
  idStore: string;
  index: number;
  handleDelete: any;
}

function Cart(props: PropsCartInterface) {
  const { prop, idStore, index, handleDelete } = props;
  const [quantity, setQuantity] = React.useState(prop.quantity);
  const [isDeleted, setIsDeleted] = React.useState(false);

  React.useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.map((store: CartInterface) => {
      store.listProducts = store.listProducts.map((product: ProductBillDto) => {
        if (product.productId === prop.productId) {
          return { ...product, quantity };
        }
        return product;
      });
      return store;
    });

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [quantity, isDeleted]);

  // add function delete product in cart from local storage
  const deleteProductInCartLocal = async (): Promise<void> => {
    const shouldDelete = window.confirm(
      "Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?"
    );
    if (!shouldDelete) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "{}");

    const res = await APIRemoveProductInCart(prop.productId);

    if (res.status !== 200 && res.status !== 201) {
      Toast("error", res.message, 5000);
      return;
    }

    cart.map((store: CartInterface) => {
      store.listProducts = store.listProducts.filter(
        (product: ProductBillDto) => product.productId !== prop.productId
      );
    });

    handleDelete(`${idStore}-${index}`);

    console.log(cart);

    localStorage.setItem("cart", JSON.stringify(cart));

    setIsDeleted(true);
  };

  const handleDecrease = () => {
    if (quantity <= 1) {
      deleteProductInCartLocal();
      return;
    }

    setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    // check số lượng sản phẩm trong kho
    // Hiển thị thông báo khi số lượng vượt quá số lượng trong kho
    setQuantity(quantity + 1);
  };

  const isChecked = (e: any) => {
    const lengthListCart = document
      .querySelector(`.store-parent-${idStore}`)
      ?.querySelectorAll('[class*="checkbox-item-"]').length;
    let checkedItems = 0;
    document
      .querySelector(`.store-parent-${idStore}`)
      ?.querySelectorAll('[class*="checkbox-item-"]')
      .forEach((item: any) => {
        if (item.checked) {
          checkedItems++;
        }
      });
    const store = document.querySelector(
      `.checkbox-store-${idStore}`
    ) as HTMLInputElement;
    const all = document.querySelector(
      `.checkbox-cart-all`
    ) as HTMLInputElement;
    if (lengthListCart === checkedItems) {
      store.checked = true;
      //
      const lengthListCart1 = document.querySelectorAll(
        '[class*="store-parent-"]'
      ).length;
      let checkedItems = 0;
      document
        .querySelectorAll('[class*="checkbox-store-"]')
        .forEach((item: any) => {
          if (item.checked) {
            checkedItems++;
          }
        });
      const all = document.querySelector(
        `.checkbox-cart-all`
      ) as HTMLInputElement;
      if (lengthListCart1 === checkedItems) {
        all.checked = true;
      } else {
        all.checked = false;
      }
    } else {
      store.checked = false;
      all.checked = false;
    }
  };

  return (
    <div
      className={`flex justify-between items-center p-2 rounded-lg text-center `}
    >
      <div className="flex items-center w-[35%] mr-[5%]">
        <input
          className={`w-4 h-4 border-2 border-slate-400 rounded-full mr-[2%] min-w-[30px] checkbox-item-${prop.productId}`}
          type="checkbox"
          onChange={(e) => isChecked(e)}
          value={prop.productId}
        ></input>
        <img
          className="rounded-full w-[54px] h-[54px] mr-2"
          src={prop.avatar}
          alt="Loading..."
        />
        <Link
          href={`/product/${prop.productId}`}
          className="text-[14px] mr-2 text-ellipsis line-clamp-2 text-left"
        >
          {prop.productName}
        </Link>
      </div>

      <span className="text-[14px] w-[20%]">{FormatMoney(prop.price)}</span>

      <div className="flex items-center justify-center">
        <button
          className="px-2 py-1 border border-[#b6caf2] rounded-l-lg"
          onClick={(e) => handleDecrease()}
        >
          -
        </button>

        <input
          className="px-3 py-1 border-t border-b border-[#b6caf2] text-center w-[20%] outline-none"
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />

        <button
          className="px-2 py-1 border border-[#b6caf2] rounded-r-lg"
          onClick={() => handleIncrease()}
        >
          +
        </button>
      </div>

      <span className="text-[14px] w-[20%]">
        {FormatMoney(prop.price * quantity)}
      </span>

      <div className="flex flex-col items-center w-[15%]">
        <span
          className="text-[14px] hover:text-[#648fe3] cursor-pointer hover:font-bold"
          onClick={() => deleteProductInCartLocal()}
        >
          Xóa
        </span>
        <span className="text-[14px] max-w-[70%] text-[#648fe3] cursor-pointer">
          Tìm sản phẩm tương tự
        </span>
      </div>
    </div>
  );
}

export default Cart;
