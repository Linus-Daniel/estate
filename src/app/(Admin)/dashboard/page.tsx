
import Card from "@/components/dashboard/Card"
import LineCharts from "@/components/dashboard/lineChart"
import PieCharts from "@/components/dashboard/pichart"
import { details } from "@/constant"

function DashBoard() {
  return (
   <main className="bg-gray-50  h-fit">
    <div className="">

    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-2 md:p-5">
        {
            details.map((item,index) =>(
                <Card key={index} item={item} />
            ))
        }
    </section>
    {/* <section className="flex flex-col md:flex-row items-center gap-4 px-3 ">
        <div className="w-full md:w-1/2 shadow-md bg-white p-2">

        <LineCharts />
        </div>
        <div className="md:w-1/2 shadow-md flex bg-white items-center justify-center ">

        <PieCharts />
        </div>
    </section> */}
        </div>
   </main>
  )
}

export default DashBoard
