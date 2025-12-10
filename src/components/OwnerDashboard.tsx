import { FaShop } from "react-icons/fa6";

export default function Dashboard() {
  return (
    <div>
      <p className="text-xl font-bold">Your Dashboard</p>
      <div className="grid yourItems grid-cols-3 gap-x-4 my-4">
        <div className="col-span-1 h-[15vh] bg-sky-200 p-2">
          <p className="font-bold">Visits</p>
          <p className="text-xl ">230</p> <span>+ 45 today</span>
        </div>
        <div className="col-span-1 h-[15vh] bg-green-200 p-2">
          <p className="font-bold">Revenue</p>
          <p className="text-xl">NGN 200,456.94</p>{" "}
          <span>+ NGN 2,045 today</span>
        </div>
      </div>
      <div className="payments my-4">
        <div>
        <p className="text-xl font-bold my-4">Payments</p>
        </div>
        <div>
          <div className="grid grid-cols-10 gap-x-4">
            <div className="grid col-span-1 justify-end">
              <FaShop className="text-2xl font-bold fill-green-400" />
            </div>
            <div className="grid col-span-7">
              <p>
                Sale: 2 Units of <i>Red Mushroom Stew</i> @ 4550 / Unit
              </p>
              <p>Transaction Reference: 112334565896</p>
            </div>
            <div className="grid col-span-2">
              <p>+ 9100 NGN</p>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-10 gap-x-4">
            <div className="grid col-span-1 justify-end">
              <FaShop className="text-2xl font-bold fill-green-400" />
            </div>
            <div className="grid col-span-7">
              <p>
                Sale: 2 Units of <i>Red Mushroom Stew</i> @ 4550 / Unit
              </p>
              <p>Transaction Reference: 112334565896</p>
            </div>
            <div className="grid col-span-2 ">
              <p>+ 9100 NGN</p>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-10 gap-x-4">
            <div className="grid col-span-1 justify-end">
              <FaShop className="text-2xl font-bold fill-green-400" />
            </div>
            <div className="grid col-span-7">
              <p>
                Sale: 2 Units of <i>Red Mushroom Stew</i> @ 4550 / Unit
              </p>
              <p>Transaction Reference: 112334565896</p>
            </div>
            <div className="grid col-span-2">
              <p>+ 9100 NGN</p>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-10 gap-x-4">
            <div className="grid col-span-1 justify-end">
              <FaShop className="text-2xl font-bold fill-green-400" />
            </div>
            <div className="grid col-span-7">
              <p>
                Sale: 2 Units of <i>Red Mushroom Stew</i> @ 4550 / Unit
              </p>
              <p>Transaction Reference: 112334565896</p>
            </div>
            <div className="grid col-span-2 ">
              <p>+ 9100 NGN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
