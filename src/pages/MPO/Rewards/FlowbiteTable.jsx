import {
    Card,
    Badge,
    Table,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
} from '@mui/material';
import Iconify from '@/components/iconify/Iconify';


const FlowbiteTable = () => {
    return (
        <div className="relative overflow-x-auto p-4 shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 static">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2  "/>
                                    <label for="checkbox-all-search" className="sr-only">checkbox</label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            S.No.
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Product name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Color
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Product name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Color
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2  "/>
                                    <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            1
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        {/* <td className="px-6 py-4">
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td> */}
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            {/* <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a> */}
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2  "/>
                                    <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            1
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        {/* <td className="px-6 py-4">
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td> */}
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            {/* <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a> */}
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2  "/>
                                    <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            1
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        {/* <td className="px-6 py-4">
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td> */}
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            {/* <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a> */}
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2  "/>
                                    <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            1
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        {/* <td className="px-6 py-4">
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td> */}
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            {/* <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a> */}
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2  "/>
                                    <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            1
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        {/* <td className="px-6 py-4">
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td> */}
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            {/* <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a> */}
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2  "/>
                                    <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            1
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        {/* <td className="px-6 py-4">
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td> */}
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            {/* <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a> */}
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2  "/>
                                    <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            1
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        {/* <td className="px-6 py-4">
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td> */}
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            {/* <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a> */}
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2  "/>
                                    <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            1
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        {/* <td className="px-6 py-4">
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td> */}
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            {/* <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a> */}
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2  "/>
                                    <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            1
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        {/* <td className="px-6 py-4">
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td> */}
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            {/* <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a> */}
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2  "/>
                                    <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            1
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        {/* <td className="px-6 py-4">
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td> */}
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Silver
                        </td>
                        <td className="px-6 py-4">
                            Laptop
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            $2999
                        </td>
                        <td className="px-6 py-4">
                            {/* <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a> */}
                            <IconButton color={'primary'} onClick={(e) => onEdit(rewards.id)}>
                                <Badge>
                                    <Iconify icon="eva:edit-fill" />
                                </Badge>
                            </IconButton>
                            <IconButton color={'error'} onClick={() => { setSelectedId(rewards.id); handleClickOpen() }}>
                                <Badge>
                                    <Iconify icon="eva:trash-2-outline" />
                                </Badge>
                            </IconButton>
                        </td>
                    </tr>
                </tbody>
            </table>
            <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900">1-10</span> of <span className="font-semibold text-gray-900">1000</span></span>
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                    <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">Previous</a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">2</a>
                    </li>
                    <li>
                        <a href="#" aria-current="page" className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-70 ">3</a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">4</a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">5</a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">Next</a>
                    </li>
                </ul>
            </nav>
        </div>

    )
}
export default FlowbiteTable