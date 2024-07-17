import { useEffect, useState } from "react";
import { useDarkTheme } from "../context/DarkThemeContext";
import ReactApexChart from "react-apexcharts";
import api from "../services/api";

interface StockData {
  date: string,
  open: number,
  high: number,
  low: number,
  close: number,
  adjClose: number,
  volume: number
}

export default function Spread() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toggleCalculo, setToggleCalculo] = useState<boolean>(true);
  const [stockA, setStockA] = useState<string>("");
  const [stockB, setStockB] = useState<string>("")
  const [dateInit, setDateInit] = useState<any>("");
  const [dateFinal, setDateFinal] = useState<any>("");
  const [spread, setSpread] = useState<number>(0);
  const [spreadActual, setSpreadActual] = useState<number>(0);
  const [stockAActual, setStockAActual] = useState<string>("");
  const [stockBActual, setStockBActual] = useState<string>("");
  const [stockAData, setStockAData] = useState<StockData[]>([{date: "", open: 0, high: 0, low: 0, close: 0, adjClose: 0, volume: 0}]);
  const [stockBData, setStockBData] = useState<StockData[]>([{date: "", open: 0, high: 0, low: 0, close: 0, adjClose: 0, volume: 0}]);

  const { isDark } = useDarkTheme();

  const options = {
    chart: {
      type: "line",
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
    stroke: {
      width: [0, 4],
      curve: 'smooth'
    },
    legend: {
      position: "bottom",
      labels: {
        colors: isDark ? "#FFFFFF" : "#000000",
      },
    },
    xaxis: {
      //@ts-ignore
      categories: spreadActual > 0 && processDataSpread(stockAData, stockBData).map(item => `Déb:${item.deb.toFixed(2)}<>Créd:${item.cred.toFixed(2)}`),
      labels: {
        style: {
          colors: isDark ? "#FFFFFF" : "#000000",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#FFFFFF" : "#000000",
        },
      },
    },
    responsive: [
      {
        breakpoint: 1220,
        options: {
          chart: {
            height: "100%",
            width: "100%",
          },
        },
      },
    ],
  };

  const optionsColumnChart = {
    chart: {
      type: "area",
      height: 280,
      stacked: false,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: "smooth"
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      labels: {
        colors: isDark ? "#FFFFFF" : "#000000",
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#FFFFFF" : "#000000",
        },
      },
    },
  };

  function cleanData(e: React.FormEvent) {
    e.preventDefault();

    setStockA("");
    setStockB("");
    setDateInit("");
    setDateFinal("");
    setSpread(0);
  }

  async function generateSpread(e: React.FormEvent){
    e.preventDefault();

    if(stockA === "" || stockB === "" || dateInit == "" || dateFinal == "" || spread == 0){
      alert("Favor preencher todos os campos corretamente para iniciar.");
    }else{ 
      setIsLoading(true);
      try {
        const { data } = await api.post("/utils/spread", {
          ativoA: stockA,
          ativoB: stockB,
          initDate: dateInit,
          finalDate: dateFinal
        }, { headers: {
          authorization: "Bearer "+ localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "https://smartfin.vercel.app/"
        }})
        //@ts-ignore
        const {ativoA, ativoB } = data;

        setStockAData(ativoA)
        setStockBData(ativoB)
        setSpreadActual(spread)
        setStockAActual(stockA)
        setStockBActual(stockB)

      } catch (err) {
        //@ts-ignore
        alert(err.response.data)
      } finally {
        setIsLoading(false)
      }
    }
  }

  function processDataSpread(stockAData: StockData[], stockBData: StockData[]){
    if(spreadActual > 0){
      const stockLength = stockAData.length >= stockBData.length ? stockBData.length : stockAData.length
      let minValue: number = 1000;
      let maxValue: number = 0;

      //@ts-ignore
      const intervalos = []
      for(let i: number = 0; i < stockLength; i++){
        /*if(Math.abs(stockAData[i].open - stockBData[i].open) >= spreadActual){
          intervalos.push({ativo:stockAData[i].open < stockBData[i].open ? stockAActual : stockBActual, dif: Math.abs(stockAData[i].open - stockBData[i].open)});
          minValue = Math.abs(stockAData[i].open - stockBData[i].open) < minValue ? Math.abs(stockAData[i].open - stockBData[i].open) : minValue
          maxValue = Math.abs(stockAData[i].open - stockBData[i].open) > maxValue ? Math.abs(stockAData[i].open - stockBData[i].open) : maxValue
        }*/
        if(Math.abs(stockAData[i].close - stockBData[i].close) >= spreadActual){
          intervalos.push({ativo:stockAData[i].close < stockBData[i].close ? stockAActual : stockBActual, dif: Math.abs(stockAData[i].close - stockBData[i].close)});
          minValue = Math.abs(stockAData[i].close - stockBData[i].close) < minValue ? Math.abs(stockAData[i].close - stockBData[i].close) : minValue
          maxValue = Math.abs(stockAData[i].close - stockBData[i].close) > maxValue ? Math.abs(stockAData[i].close - stockBData[i].close) : maxValue
        }
      }

      let resultado = [];

      for(let j: number = minValue; j < maxValue; j+=spreadActual){
        let freq = intervalos.reduce((counter, item) => {
          if(item.dif >= j && item.dif < j + spreadActual){
            return counter + 1;
          }
          return counter
        }, 0)

        resultado.push({deb: j, cred: j + spreadActual, freq,})
      }

      console.log(intervalos.length, resultado.length)
      
      return resultado
    }
  }

  useEffect(() => {
    const today = new Date();
    setDateFinal(today.toISOString().split("T")[0])
  }, [])

  return (
    <div className="md:flex md:flex-row flex flex-col h-[100%] w-[100%] gap-4">
      <div className="flex flex-col bg-[#FFFFFF] md:w-[30%] md:h-[100%] rounded-lg p-4 overflow-scroll no-scrollbar dark:bg-[#141414]">
        <h1 className="text-2xl font-bold text-[#0E0E19] dark:text-[#EDEEF0]">
          Spreads
        </h1>

        <button
          className="flex bg-[#EFEFEF] mt-3 w-[100%] border-2 border-[#000000] p-3 rounded-lg justify-between items-center"
          onClick={() => setToggleCalculo(!toggleCalculo)}
        >
          <p>Dados</p>
          <img
            src="/assets/expand-dropdown.png"
            alt="Expandir opções"
            className={`${toggleCalculo && "rotate-180"} duration-200`}
          />
        </button>

        {toggleCalculo && (
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              generateSpread(e);
            }}
          >
            <div className="flex gap-2">
              <div className="flex w-[50%] items-center justify-between py-2 px-4 rounded-lg border-b-2 border-[#000000] dark:border-[#EDEEF0]">
                <div className="flex flex-1 flex-col">
                  <label
                    className="dark:text-[#EDEEF0]"
                    htmlFor="#inputSalario"
                  >
                    Ativo A
                  </label>
                  <input
                    className="font-bold w-[100%] text-xl bg-transparent outline-none dark:text-[#EDEEF0]"
                    id="inputSalario"
                    type="text"
                    value={stockA}
                    onChange={(e) => {setStockA(e.target.value)}}
                  />
                </div>
              </div>

              <div className="flex w-[50%] items-center justify-between py-2 px-4 rounded-lg border-b-2 border-[#000000] dark:border-[#EDEEF0]">
                <div className="flex flex-1 flex-col">
                  <label
                    className="dark:text-[#EDEEF0]"
                    htmlFor="#inputSalario"
                  >
                    Ativo B
                  </label>
                  <input
                    className="font-bold w-[100%] text-xl bg-transparent outline-none dark:text-[#EDEEF0]"
                    id="inputSalario"
                    type="text"
                    value={stockB}
                    onChange={(e) => {setStockB(e.target.value)}}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex flex-1 items-center w-[50%] justify-between py-2 px-4 rounded-lg border-b-2 border-[#000000] dark:border-[#EDEEF0]">
                <div className="flex flex-col">
                  <label
                    className="dark:text-[#EDEEF0]"
                    htmlFor="#inputSalario"
                  >
                    Data inicial
                  </label>
                  <input
                    className="font-bold text-sm w-[90%] bg-transparent outline-none dark:text-[#EDEEF0]"
                    id="inputSalario"
                    type="date"
                    placeholder={new Date().toISOString().split("T")[0]}
                    value={dateInit}
                    onChange={(e) => {setDateInit(e.target.value)}}
                  />
                </div>
              </div>

              <div className="flex flex-1 items-center w-[50%] justify-between py-2 px-4 rounded-lg border-b-2 border-[#000000] dark:border-[#EDEEF0]">
                <div className="flex flex-col">
                  <label
                    className="dark:text-[#EDEEF0]"
                    htmlFor="#inputSalario"
                  >
                    Data final
                  </label>
                  <input
                    className="font-bold text-sm w-[80%] bg-transparent outline-none dark:text-[#EDEEF0]"
                    id="inputSalario"
                    type="date"
                    value={dateFinal}
                    onChange={(e) => {setDateFinal(e.target.value)}}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-between py-2 px-4 rounded-lg border-b-2 border-[#000000] dark:border-[#EDEEF0]">
              <div className="flex flex-col">
                <label className="dark:text-[#EDEEF0]" htmlFor="#inputSalario">
                  Spread desejado
                </label>
                <input
                  className="font-bold text-xl bg-transparent outline-none dark:text-[#EDEEF0]"
                  id="inputSalario"
                  type="number"
                  value={spread}
                  onChange={(e) => {setSpread(Number(e.target.value))}}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                type="reset"
                className="bg-[#E1E3E6] p-3 w-[50%] rounded-lg"
                onClick={(e) => cleanData(e)}
              >
                <p className="text-[#28292B] text-lg">Limpar</p>
              </button>

              <button
                type="submit"
                className="bg-[#068FF2] p-3 w-[50%] rounded-lg"
                onClick={(e) => {
                  generateSpread(e);
                }}
              >
                <p className="text-[#FFFFFF] text-lg">{ isLoading ? "Carregando..." : "Confirmar"}</p>
              </button>
            </div>
          </form>
        )}

        <h1 className="text-2xl font-bold text-[#0E0E19] mt-3 dark:text-[#EDEEF0]">
          Como utilizar a função de spread
        </h1>

        <ul className="flex flex-col mt-4 gap-2 p-2">
          <li className="dark:text-[#EDEEF0]">
            1. Escolha os ativos que deseja comparar;
          </li>
          <li className="dark:text-[#EDEEF0]">
            2. Escolha o período desejado;
          </li>
          <li className="dark:text-[#EDEEF0]">
            3. Indique o spread desejado;
          </li>
          <li className="dark:text-[#EDEEF0]">
            4. Clique em confirmar e veja o resultado;
          </li>
        </ul>

        <p className="mt-3 p-2 dark:text-[#EDEEF0]">
          Viu como é simples? Agora é só fazer suas simulações.
        </p>
      </div>

      <div className="flex flex-col bg-[#FFFFFF] gap-3 md:h-[100%] md:w-[70%] rounded-lg overflow-scroll no-scrollbar dark:bg-[#141414]">
        <div className="flex flex-col p-4 rounded-lg gap-3 w-[100%] h-[70%] justify-between ">

          {/* <ul className="flex gap-3">
            <li className="flex flex-col gap-2 items-center justify-center flex-1 rounded-lg bg-[#EDEEF0] p-4">
              <p className="">Valor total final</p>
              <h2 className="font-bold text-xl">
                R$ {0.00.toFixed(2).replace(".", ",")}
              </h2>
            </li>
            <li className="flex flex-col gap-2 items-center justify-center flex-1 rounded-lg bg-[#EDEEF0] p-4">
              <p className="">Valor total investido</p>
              <h2 className="font-bold text-xl">
                R$ {0.00.toFixed(2).replace(".", ",")}
              </h2>
            </li>
            <li className="flex flex-col gap-2 items-center justify-center flex-1 rounded-lg bg-[#EDEEF0] p-4">
              <p className="">Total de juros</p>
              <h2 className="font-bold text-xl">
                R$ {0.00.toFixed(2).replace(".", ",")}
              </h2>
            </li>
          </ul> */}

          {spreadActual <= 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <h3 className="font-semibold text-lg dark:text-[#EDEEF0]">
                Preencha os dados para visualizar os resultados.
              </h3>
            </div>
          ) : (
            <>
              <div>
                {/*@ts-ignoreD*/}
                <ReactApexChart
                  options={options}
                  series={[{
                    name: 'Camadas',
                    type: 'column',
                    //@ts-ignore
                    data: processDataSpread(stockAData, stockBData).map(item=> item.freq)
                  }, {
                    name: 'Representatividade',
                    type: 'line',
                    //@ts-ignore
                    data: processDataSpread(stockAData, stockBData).map(item => item.freq).map((item:number) => (item*100/processDataSpread(stockAData, stockBData).map(item => item.freq).reduce((acc, item) => acc + item, 0)).toFixed(2))
                  }]}
                  type="line"
                  height={280}
                />
              </div>

              <div>
                <ReactApexChart
                  //@ts-ignore
                  options={optionsColumnChart}
                  series={[{
                    name: stockA.toUpperCase(),
                    data: stockAData.map((item) => item.close)
                  }, {
                    name: stockB.toUpperCase(),
                    data: stockBData.map((item) => item.close)
                  }]}
                  type="area"
                  height={280}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex-col p-4 rounded-lg gap-3 w-[100%]"></div>
      </div>
    </div>
  );
}
