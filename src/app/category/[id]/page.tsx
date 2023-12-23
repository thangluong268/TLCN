"use client";
import CardProduct from "@/components/CardProduct";
import Filter from "@/components/Filter";
import FrameMainContent from "@/components/FrameMainContent";
import Paging from "@/components/Paging";
import { APIGetListProductWithCategory } from "@/services/Category";
import { useParams } from "next/navigation";
import React from "react";

function Category() {
  const [idCategory, setIdCategory] = React.useState<any>(null);
  const param = useParams() as any;
  console.log(param);
  // page?: any,
  // limit?: any,
  // search?: any,
  // priceMin?: any,
  // priceMax?: any,
  // quantityMin?: any,
  // quantityMax?: any,
  // createdAtMin?: any,
  // createdAtMax?: any
  const [page, setPage] = React.useState<any>(1);
  const [limit, setLimit] = React.useState<any>(5);
  const [search, setSearch] = React.useState<any>("");
  const [query, setQuery] = React.useState<any>({
    priceMin: "",
    priceMax: "",
    quantityMin: "",
    quantityMax: "",
    createdAtMin: "",
    createdAtMax: "",
  });

  const [isFilter, setIsFilter] = React.useState<any>(false);
  const [lstProduct, setLstProduct] = React.useState<any[]>([]); // Update the type of lstProduct to any[]
  const [totalPage, setTotalPage] = React.useState<any>(1);
  const [categoryName, setCategoryName] = React.useState<any>("");
  React.useEffect(() => {
    console.log(query);
    const fetchData = async () => {
      await APIGetListProductWithCategory(
        page,
        5,
        param.id,
        query.priceMin,
        query.priceMax,
        query.quantityMin,
        query.quantityMax,
        query.createdAtMin,
        query.createdAtMax
      ).then((res: any) => {
        setLstProduct(res.metadata.data.products);
        setTotalPage(res.metadata.data.total);
        setCategoryName(res.metadata.data.categoryName);
      });
    };
    fetchData();
  }, [page, query]);
  return (
    <FrameMainContent>
      <div className="flex mt-2 justify-between">
        <div className="flex flex-col w-2/12 mr-2 ">
          <div className="bg-white p-2 rounded-xl">
            <div className="flex flex-col">
              <div className="font-bold py-2">Bộ lọc</div>
              <div className="flex flex-col">
                <Filter setQuery={setQuery} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-10/12">
          <div className="flex flex-col bg-white p-4 rounded-xl mb-2">
            <div className="flex justify-between">
              <div>
                Các sản phẩm liên quan đến &ldquo;
                <i className="font-bold text-">{categoryName}</i>&ldquo;
              </div>
            </div>
            <div className="grid grid-cols-5 gap-y-4 mt-5">
              {lstProduct &&
                lstProduct.map((item: any, index: any) => {
                  return (
                    <CardProduct
                      className="col-span-1"
                      key={index}
                      data={item}
                    />
                  );
                })}
            </div>
            <Paging
              totalPage={totalPage}
              currentPage={page}
              setPage={setPage}
              perPage={20}
            />
          </div>
        </div>
      </div>
    </FrameMainContent>
  );
}

export default Category;
