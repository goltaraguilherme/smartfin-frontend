import { useEffect, useState } from "react";
import { useDarkTheme } from "../context/DarkThemeContext";
import ReactApexChart from "react-apexcharts";
import api from "../services/api";
import Cookies from "js-cookie";

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
}

export default function Spread() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingSuggest, setIsLoadingSuggest] = useState<boolean>(false);
  const [toggleCalculo, setToggleCalculo] = useState<boolean>(true);
  const [toggleSugestoes, setToggleSugestoes] = useState<boolean>(false);
  const [optionSelected, setOptionSelected] = useState<string>("sugest");
  const [comentario, setComentario] = useState<string>("");
  const [stockA, setStockA] = useState<string>("");
  const [stockB, setStockB] = useState<string>("");
  const [dateInit, setDateInit] = useState<any>("");
  const [dateFinal, setDateFinal] = useState<any>("");
  const [spread, setSpread] = useState<number>(0);
  const [spreadActual, setSpreadActual] = useState<number>(0);
  const [stockAActual, setStockAActual] = useState<string>("");
  const [stockBActual, setStockBActual] = useState<string>("");
  const [stockAData, setStockAData] = useState<StockData[]>([
    { date: "", open: 0, high: 0, low: 0, close: 0, adjClose: 0, volume: 0 },
  ]);
  const [stockBData, setStockBData] = useState<StockData[]>([
    { date: "", open: 0, high: 0, low: 0, close: 0, adjClose: 0, volume: 0 },
  ]);
  const [stockAFreq, setStockAFreq] = useState<number>(0);
  const [stockBFreq, setStockBFreq] = useState<number>(0);

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
      curve: "smooth",
    },
    legend: {
      position: "bottom",
      labels: {
        colors: isDark ? "#FFFFFF" : "#000000",
      },
    },
    xaxis: {
      //@ts-ignore
      categories:
        spreadActual > 0 && //@ts-ignore
        processDataSpread(stockAData, stockBData).map(
          (item) => `Déb:${item.deb.toFixed(2)}<>Créd:${item.cred.toFixed(2)}`
        ),
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
      curve: "smooth",
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

  async function generateSpread(e: React.FormEvent) {
    e.preventDefault();

    if (
      stockA.trim() === "" ||
      stockB.trim() === "" ||
      dateInit == "" ||
      dateFinal == "" ||
      spread == 0
    ) {
      alert("Favor preencher todos os campos corretamente para iniciar.");
    } else {
      setIsLoading(true);
      try {
        const { data } = await api.post(
          "/utils/spread",
          {
            ativoA: stockA.trim(),
            ativoB: stockB.trim(),
            initDate: dateInit,
            finalDate: dateFinal,
          },
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
              "Access-Control-Allow-Origin": "https://smartfin.vercel.app/",
            },
          }
        );
        //@ts-ignore
        const { ativoA, ativoB } = data;

        setStockAData(ativoA);
        setStockBData(ativoB);
        setSpreadActual(spread);
        setStockAActual(stockA.trim());
        setStockBActual(stockB.trim());
      } catch (err) {
        //@ts-ignore
        alert(err.response.data);
      } finally {
        setIsLoading(false);
      }
    }
  }

  function processDataSpread(stockAData: StockData[], stockBData: StockData[]) {
    if (spreadActual > 0) {
      const stockLength =
        stockAData.length >= stockBData.length
          ? stockBData.length
          : stockAData.length;
      let minValue: number = 1000;
      let maxValue: number = 0;

      //@ts-ignore
      const intervalos = [];
      for (let i: number = 0; i < stockLength; i++) {

          intervalos.push({
            ativo:
              stockAData[i].close < stockBData[i].close
                ? stockBActual
                : stockAActual,
            dif: Number(
              Math.abs(stockAData[i].close - stockBData[i].close).toFixed(2)
            ),
          });

          minValue =
            Number(
              Math.abs(stockAData[i].close - stockBData[i].close).toFixed(2)
            ) < minValue
              ? Number(
                  Math.abs(stockAData[i].close - stockBData[i].close).toFixed(2)
                )
              : minValue;

          maxValue =
            Number(
              Math.abs(stockAData[i].close - stockBData[i].close).toFixed(2)
            ) > maxValue
              ? Number(
                  Math.abs(stockAData[i].close - stockBData[i].close).toFixed(2)
                )
              : maxValue;
      }

      let stockAFreqLocal = intervalos.filter(
        (item) => item.ativo == stockAActual
      ).length;
      let stockBFreqLocal = intervalos.filter(
        (item) => item.ativo == stockBActual
      ).length;

      if (stockAFreqLocal != stockAFreq) {
        setStockAFreq(stockAFreqLocal);
        setStockBFreq(stockBFreqLocal);
      }

      let resultado = [{deb: 0.0, cred: 0.0, freq: 0}]; 

      for (let j: number = 0; j < intervalos.length; j++) {
        let minClass = j == 0 ? minValue : ((resultado[resultado.length -1].freq == 0) ? (resultado[resultado.length -1].deb+0.01).toFixed(2) : ((resultado[resultado.length -1].cred).toFixed(2)));
        let maxClass = Number((Number(minClass) + spreadActual).toFixed(2));

        let hasMinClass = intervalos.some((item) => item.dif == Number(minClass));
        let hasMaxClass = intervalos.some((item) => item.dif == Number(maxClass));

        if(hasMaxClass && hasMinClass){
          //let classe = `deb:${minClass}<>cred:${maxClass}`;

          let freq = intervalos.reduce((counter, item) => {
            if (item.dif >= Number(minClass) && item.dif < Number(maxClass)) {
              return counter + 1;
            }
            return counter;
          }, 0);
  
          resultado.push({deb: Number(minClass), cred:  Number(maxClass), freq });
        }else{
          resultado.push({deb: Number(minClass), cred: Number(maxClass), freq: 0 });
        }
      }

      resultado = resultado.filter(item => item.freq > 0);

      console.log(resultado)

      return resultado;
    }
  }

  async function generateComment(e: React.FormEvent) {
    e.preventDefault();
    if(comentario == "")
      return alert("Voce precisa preencher o campo de comentário antes de enviar.")

    setIsLoadingSuggest(true);
    try {
      const { data } = await api.post("/utils/comments", {
        comment: comentario,
        type: optionSelected,
        userEmail: Cookies.get("email"),
      },
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "https://smartfin.vercel.app/",
        },
      }
    )

      const { newComment } = data;
      if(newComment){
        alert("Enviado com sucesso!")
      }
      
    } catch (error) {
      //@ts-ignore
      alert(error.response.data)
    }finally {
      setIsLoadingSuggest(false)
    }
  }

  useEffect(() => {
    const today = new Date();
    setDateFinal(today.toISOString().split("T")[0]);
  }, []);

  return (
    <div className="md:flex md:flex-row flex flex-col h-[100vh] w-[100%] gap-4">
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
                    onChange={(e) => {
                      setStockA(e.target.value);
                    }}
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
                    onChange={(e) => {
                      setStockB(e.target.value);
                    }}
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
                    onChange={(e) => {
                      setDateInit(e.target.value);
                    }}
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
                    onChange={(e) => {
                      setDateFinal(e.target.value);
                    }}
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
                  onChange={(e) => {
                    setSpread(Number(e.target.value));
                  }}
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
                <p className="text-[#FFFFFF] text-lg">
                  {isLoading ? "Carregando..." : "Confirmar"}
                </p>
              </button>
            </div>
          </form>
        )}

        <button
          className="flex bg-[#EFEFEF] mt-3 w-[100%] border-2 border-[#000000] p-3 rounded-lg justify-between items-center"
          onClick={() => setToggleSugestoes(!toggleSugestoes)}
        >
          <p>Sugestões/Dúvidas</p>
          <img
            src="/assets/expand-dropdown.png"
            alt="Expandir opções"
            className={`${toggleSugestoes && "rotate-180"} duration-200`}
          />
        </button>

        {toggleSugestoes && (
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              generateComment(e);
            }}
          >
            <div className="flex mt-3">
              <div className="flex flex-1 gap-3 font-semibold">
                <input 
                  className="cursor-pointer"
                  type="radio" 
                  id="sugest" 
                  name="sugest" 
                  value="sugest" 
                  checked={optionSelected === "sugest" ? true : false} 
                  onClick={() => setOptionSelected("sugest")} />
                <label htmlFor="sugest" className="dark:text-[#EDEEF0]">
                  Sugestão
                </label>
              </div>

              <div className="flex flex-1 gap-3 font-semibold">
                <input 
                  className="cursor-pointer dark:text-[#EDEEF0]"
                  type="radio" 
                  id="duvida" 
                  name="duvida" 
                  value="duvida" 
                  checked={optionSelected === "duvida" ? true : false} 
                  onClick={() => setOptionSelected("duvida")} />
                <label htmlFor="duvida" className="dark:text-[#EDEEF0]">Dúvida</label>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-between py-2 px-4 rounded-lg border-b-2 border-[#000000] dark:border-[#EDEEF0]">
              <div className="flex flex-1 flex-col">
                <label className="dark:text-[#EDEEF0]" htmlFor="#inputSugestoes">
                  Comentário
                </label>
                <textarea
                  className="block p-2 bg-transparent w-full text-sm outline-none dark:text-[#EDEEF0] dark:color-[#EDEEF0] "
                  placeholder="Escreva seus comentários aqui..."
                  rows={5}
                  id="inputSugestoes"
                  value={comentario}
                  onChange={(e) => {
                    setComentario(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                type="reset"
                className="bg-[#E1E3E6] p-3 w-[50%] rounded-lg"
                onClick={(e) => {
                  e.preventDefault();
                  setComentario("")
                }}
              >
                <p className="text-[#28292B] text-lg">Limpar</p>
              </button>

              <button
                type="submit"
                className="bg-[#068FF2] p-3 w-[50%] rounded-lg"
                onClick={(e) => {
                  generateComment(e);
                }}
              >
                <p className="text-[#FFFFFF] text-lg">
                  {isLoadingSuggest ? "Carregando..." : "Enviar"}
                </p>
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
          <li className="dark:text-[#EDEEF0]">3. Indique o spread desejado;</li>
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
          {spreadActual <= 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <h3 className="font-semibold text-lg dark:text-[#EDEEF0]">
                Preencha os dados para visualizar os resultados.
              </h3>
            </div>
          ) : (
            <>
              <ul className="flex gap-3">
                <li className="flex flex-col gap-2 items-center justify-center flex-1 rounded-lg bg-[#EDEEF0] p-4">
                  <p className="">Freq. {stockAActual.toUpperCase()}</p>
                  <h2 className="font-bold text-xl">
                    {stockAFreq} |{" "}
                    {((stockAFreq * 100) / (stockAFreq + stockBFreq))
                      .toFixed(2)
                      .replace(".", ",")}{" "}
                    %
                  </h2>
                </li>
                <li className="flex flex-col gap-2 items-center justify-center flex-1 rounded-lg bg-[#EDEEF0] p-4">
                  <p className="">Freq. {stockBActual.toUpperCase()}</p>
                  <h2 className="font-bold text-xl">
                    {stockBFreq} |{" "}
                    {((stockBFreq * 100) / (stockAFreq + stockBFreq))
                      .toFixed(2)
                      .replace(".", ",")}{" "}
                    %
                  </h2>
                </li>
                <li className="flex flex-col gap-2 items-center justify-center flex-1 rounded-lg bg-[#EDEEF0] p-4">
                  <p className="">Maior</p>
                  <h2 className="font-bold text-xl">
                    {stockAFreq > stockBFreq
                      ? stockAActual.toUpperCase()
                      : stockBActual.toUpperCase()}
                  </h2>
                </li>
              </ul>
              <div>
                {/*@ts-ignore*/}
                <ReactApexChart
                  options={options}
                  series={[
                    {
                      name: "Negociações",
                      type: "column",
                      //@ts-ignore
                      data: processDataSpread(stockAData, stockBData).map(
                        (item) => item.freq
                      ),
                    },
                    {
                      name: "% de negociações",
                      type: "line",
                      //@ts-ignore
                      data: processDataSpread(stockAData, stockBData)
                        .map((item) => item.freq)
                        .map((item: number) =>
                          (
                            (item * 100) / //@ts-ignore
                            processDataSpread(stockAData, stockBData)
                              .map((item) => item.freq)
                              .reduce((acc, item) => acc + item, 0)
                          ).toFixed(2)
                        ),
                    },
                  ]}
                  type="line"
                  height={280}
                />
              </div>

              <div>
                <ReactApexChart
                  //@ts-ignore
                  options={optionsColumnChart}
                  series={stockAData[0].close >= stockBData[0].close ?
                      [{
                        name: stockAActual.toUpperCase(),
                        data: stockAData.map((item) => item.close),
                      },
                      {
                        name: stockBActual.toUpperCase(),
                        data: stockBData.map((item) => item.close),
                      }] 
                      :
                      [{
                        name: stockBActual.toUpperCase(),
                        data: stockBData.map((item) => item.close),
                      },
                      {
                        name: stockAActual.toUpperCase(),
                        data: stockAData.map((item) => item.close),
                      }]
                  }
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
