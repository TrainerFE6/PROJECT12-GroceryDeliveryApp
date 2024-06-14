import { useEffect, useState } from "react";
import Breadcrumb from "../../componentsBackoffice/Breadcrumbs/Breadcrumb";
import TableOne from "../../componentsBackoffice/Tables/TableOne";
import TableThree from "../../componentsBackoffice/Tables/TableThree";
import TableTwo from "../../componentsBackoffice/Tables/TableTwo";
import DefaultLayout from "../../layout/DefaultLayout";
import Modal from "../../componentsBackoffice/Modal";
import { set, useForm } from "react-hook-form";
import instance from "../../https/core";
import FormInput from "../../componentsBackoffice/Forms/FormInput";
import toast, { Toaster } from "react-hot-toast";
import { asset, baseUrl } from "../../url";
import ModalDelete from "../../componentsBackoffice/ModalDelete";
import { useNavigate } from "react-router-dom";
import React from "react";
import { render } from "react-dom";
// import { process } from 'node';

type FormProduct = {
  id?: number;
  name: string;
  category_id: number | string;
  sku: string;
  description: string;
  min_order: string;
  weight: string;
  price: string;
  stock: string;
};

const Product = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [deleteID, setDeleteID] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const additionalAction = [
    {
      label: "Gambar",
      color: "bg-warning",
      onClick: (row) => {
        console.log("Gambar", row);
        navigate(`/backoffice/master/product-image/${row.id}`);
      },
    },
  ];
  const header = [
    {
      key: "id",
      title: "Gambar",
      render: (row) => {
        return row.ProductImages.length > 0 ? (
          <img
            src={asset(row.ProductImages[0].path)}
            alt="gambar"
            className="w-10 h-10"
          />
        ) : (
          <span>-</span>
        );
      },
    },
    {
      key: "category.name",
      title: "Kategori",
      render: (row) => {
        return <span>{row?.Category?.name || "-"}</span>;
      },
    },
    {
      key: "name",
      title: "Nama",
    },
    {
      key: "sku",
      title: "SKU",
    },
    // {
    //   key: "min_order",
    //   title: "Minimal Order",
    // },
    {
      key: "weight",
      title: "Berat",
    },
    {
      key: "price",
      title: "Harga",
      render: (row) => {
        return (
          <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.price) || '-'}</span>
        )
      }
    },
    {
      key: "stock",
      title: "Stok",
    },
    {
      key: "description",
      title: "Deskripsi",
      render: (row) => {
        return (
          <span>{row?.description?.substring(0, 50) || '-'}</span>
        )
      }
    },
  ];
  const [data, setData] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormProduct>();

  const handleAdd = () => {
    console.log("Add");
    reset();
    setVisibleModal(!visibleModal);
  };

  const handleEdit = (row) => {
    console.log(row);
    setValue("id", row.id);
    setValue("name", row.name);
    setValue("category_id", row.category_id);
    setValue("sku", row.sku);
    setValue("description", row.description);
    setValue("min_order", row.min_order);
    setValue("weight", row.weight);
    setValue("price", row.price);
    setValue("stock", row.stock);

    setVisibleModal(true);
  };

  const handleDelete = async (row) => {
    setDeleteID(row.id);
  };

  const handleModalClose = () => {
    console.log("close");
    reset();
    setVisibleModal(false);
  };

  const handleModalDeleteClose = () => {
    console.log("close");
    setDeleteID(0);
  };

  const fetchData = async () => {
    try {
      const res = await instance.get("products/list");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataCategories = async () => {
    try {
      const res = await instance.get("categories/list");
      setDataCategories(
        res.data.map((item) => ({ value: item.id, label: item.name }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit: SubmitHandler<FormProduct> = async (data) => {
    try {
      console.log(data);
      const payload = {
        ...data,
        min_order: 1,
      };

      const proccess = async () => {
        setIsLoading(true);
        if (!data.id) await instance.post("products/create", payload);
        else await instance.post("products/update", payload);
        setIsLoading(false);
      };

      await toast.promise(proccess(), {
        loading: "Menyimpan...",
        success: <b>Operasi berhasil!</b>,
        error: <b>Operasi Gagal.</b>,
      });

      setVisibleModal(false);
      fetchData();
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      if (error?.details?.length) {
        error.details.forEach((err) => {
          toast.error(err.message);
        });
      }
    }
  };

  const onDelete = async () => {
    try {
      const proccess = async () => {
        return await instance.post("products/delete", { id: deleteID });
      };

      await toast.promise(proccess(), {
        loading: "Menghapus...",
        success: <b>Data berhasil dihapus!</b>,
        error: <b>Data gagal dihapus.</b>,
      });

      setDeleteID(0);
      fetchData();
    } catch (error) {
      if (error && error.message) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (data.length === 0) {
      fetchData();
    }
    if (dataCategories.length === 0) {
      fetchDataCategories();
    }
  });

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Produk" />
      <div className="flex flex-col gap-10">
        <TableTwo
          title="Data Produk"
          header={header}
          data={data}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          additionalAction={additionalAction}
        />
      </div>
      <Modal
        title={`${watch('id') ? 'Ubah' : 'Tambah'} Produk`}
        visible={visibleModal}
        isLoading={isLoading}
        onClose={handleModalClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="font-medium text-gray-800">Kategori</label>
          <select
            {...register("category_id")}
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          >
            <option value="">Pilih Kategori</option>
            {dataCategories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <label className="font-medium text-gray-800">Nama</label>
          <input
            type="text"
            defaultValue=""
            {...register("name")}
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          />

          <label className="font-medium text-gray-800 hidden">
            Minimal Order
          </label>
          <input
            type="text"
            hidden
            defaultValue="1"
            {...register("min_order")}
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          />

          <div className="flex gap-4">
            <div>
              <label className="font-medium text-gray-800">SKU</label>
              <input
                type="text"
                defaultValue=""
                {...register("sku")}
                className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
              />
            </div>
            <div>
              <label className="font-medium text-gray-800">Berat</label>
              <input
                type="number"
                defaultValue=""
                {...register("weight")}
                className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
              />
            </div>
          </div>

          <label className="font-medium text-gray-800">Harga</label>
          <input
            type="number"
            defaultValue=""
            {...register("price")}
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          />

          <label className="font-medium text-gray-800">Stok</label>
          <input
            type="number"
            defaultValue=""
            {...register("stock")}
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          />

          <label className="font-medium text-gray-800">Deskripsi</label>
          {/* <input
            type="text"
            defaultValue=""
            {...register("sku")}
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          /> */}
          <textarea
            {...register("description")}
            className="w-full outline outline-1 bg-gray rounded dark:bg-white dark:outline-none p-2 mt-2 mb-3"
          ></textarea>

          <div className="bg-gray-200  py-3 text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="py-2 px-4 bg-blue-500 text-white rounded font-medium hover:bg-blue-700 transition duration-500"
            >
              {isLoading ? "Loading..." : watch("id") ? "Ubah" : "Tambah"}
            </button>
          </div>
        </form>
      </Modal>
      <ModalDelete
        visible={deleteID}
        onClose={handleModalDeleteClose}
        onConfirm={onDelete}
      />
    </DefaultLayout>
  );
};

export default Product;
