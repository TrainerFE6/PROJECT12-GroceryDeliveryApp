import React, { useEffect } from 'react';
import { set, useForm } from 'react-hook-form';
import instance from '../../../https/core';
import toast from 'react-hot-toast';

type  FormCustomer = {
    name: string
    email: string
    phone_number: string
    province_id: string
    city_id: string
    address: string
    password: string
  }

const Profile = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [user, setUser] = React.useState<any>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});
    const [provinces, setProvinces] = React.useState([]);
    const [cities, setCities] = React.useState([]);

    const {
      register,
      handleSubmit,
      watch,
      setValue,
      getValues,
      reset,
      formState: { errors },
    } = useForm<FormCustomer>({
      defaultValues: {
        name: '',
        email: '',
        phone_number: '',
        province_id: user.province_id,
        city_id: user.province_id,
        address: '',
        password: ''
      }
    })

    const onSubmit: SubmitHandler<FormCustomer> = async (data) => {
        try {
          const payload = {
            // id: data?.id,
            ...data
          }
          if (!data.password) delete payload.password
    
          const proccess = async () => {
            setIsLoading(true)
            await instance.post('auth-customers/update-profile', payload);
            localStorage.setItem('user', JSON.stringify(payload));
            setIsLoading(false)
          }
    
          await toast.promise(
            proccess(),
             {
               loading: 'Menyimpan...',
               success: <b>Operasi berhasil!</b>,
               error: <b>Operasi Gagal.</b>,
             }
          );          
        } catch (error) {
          setIsLoading(false)
          console.log(error)
          if (error?.details?.length) {
            error.details.forEach((err) => {
              toast.error(err.message)
            })
          }
        }
    }

    const fetchProvince = async () => {
      try {
        const res = await instance.get('raja-ongkir/provinces');
        setProvinces(res.data.map((x) => {
          return {
            value: x.id,
            label: x.name
          }
        }))
      } catch (error) {
        // console.log(error)
      }
    }
  
    const fetchCity = async (province_id) => {
      try {
        // setValue('city_id', '');
        setCities([]);
  
        const res = await instance.get(`raja-ongkir/cities?province_id=${province_id}`);
        setCities(res.data.map((x) => {
          return {
            value: x.id,
            label: `${x.type} ${x.name}`
          };
        }));
      } catch (error) {
        // console.log(error)
      }
    }

    useEffect(() => {
      if (user) {
        
        fetchProvince().then((res) => {
          // console.log('after tes');
          setValue('province_id', user.province_id)
          fetchCity(user.province_id).then(() => {
            // console.log('after tes2')
            setValue('city_id', user.city_id)
            
            const tes = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
            setValue('name', user.name)
            setValue('email', user.email)
            setValue('phone_number', user.phone_number)
            // setValue('province_id', tes.province_id)
            // setValue('city_id', tes.city_id)
            setValue('address', user.address)
          })
        });
      }
    }, [])

    return (
        <form className="flex-grow max-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2 show">
                    <hr className="mb-2" />
                    <h1 className="font-bold text-2xl">Profile Pengguna</h1>
                    <hr className="my-2" />
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-xs">Nama Pelanggan</label>
                      <input
                          type="text"
                          defaultValue=""
                          {...register("name")}
                          placeholder='Nama Pelanggan'
                          className="appearance-none px-4 py-2 text-xs tracking-widest border border-gray-200 rounded focus:outline-none focus:ring-4 focus:ring-gray-200 focus:border-transparent bg-white transition duration-200 ease-in-out"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-xs">Email</label>
                      <input
                          type="text"
                          defaultValue=""
                          {...register("email")}
                          placeholder='Email'
                          className="appearance-none px-4 py-2 text-xs tracking-widest border border-gray-200 rounded focus:outline-none focus:ring-4 focus:ring-gray-200 focus:border-transparent bg-white transition duration-200 ease-in-out"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-xs">Nomor Telepon</label>
                      <input
                          type="text"
                          defaultValue=""
                          {...register("phone_number")}
                          placeholder='Nomor Telepon'
                          className="appearance-none px-4 py-2 text-xs tracking-widest border border-gray-200 rounded focus:outline-none focus:ring-4 focus:ring-gray-200 focus:border-transparent bg-white transition duration-200 ease-in-out"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-xs">Alamat</label>
                      <input
                          type="text"
                          defaultValue=""
                          {...register("address")}
                          placeholder='Alamat'
                          className="appearance-none px-4 py-2 text-xs tracking-widest border border-gray-200 rounded focus:outline-none focus:ring-4 focus:ring-gray-200 focus:border-transparent bg-white transition duration-200 ease-in-out"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-xs">Provinsi</label>
                      <select
                          {...register("province_id")}
                          defaultValue={user.province_id}
                          onChange={(e) => { fetchCity(e.target.value); }}
                          // value={user.province_id}
                          // selected={item.value == user.city_id}
                          className="appearance-none px-4 py-2 text-xs tracking-widest border border-gray-200 rounded focus:outline-none focus:ring-4 focus:ring-gray-200 focus:border-transparent bg-white transition duration-200 ease-in-out"
                      >
                          <option value="">Pilih Provinsi</option>
                          {provinces.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-xs">Kota</label>
                      <select
                          {...register("city_id")}
                          defaultValue={user.city_id}
                          // value={user.city_id}
                          // selected={item.value == user.city_id}
                          className="appearance-none px-4 py-2 text-xs tracking-widest border border-gray-200 rounded focus:outline-none focus:ring-4 focus:ring-gray-200 focus:border-transparent bg-white transition duration-200 ease-in-out"
                      >
                          <option value="">Pilih Kota</option>
                          {cities.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-xs">Password</label>
                      <input
                          type="password"
                          defaultValue=""
                          {...register("password")}
                          placeholder='Password'
                          className="appearance-none px-4 py-2 text-xs tracking-widest border border-gray-200 rounded focus:outline-none focus:ring-4 focus:ring-gray-200 focus:border-transparent bg-white transition duration-200 ease-in-out"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                        <button className="bg-blue-500 hover:bg-blue-600 transition duration-200 ease-in-out rounded text-xs px-3 py-2 tracking-widest text-white font-semibold focus:outline-none">
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Profile;