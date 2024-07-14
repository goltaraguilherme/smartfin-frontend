import { useEffect, useState } from "react";
import { useDarkTheme } from "../context/DarkThemeContext";
import ReactApexChart from "react-apexcharts";


export default function CalculadoraJurosCompostos(){
    const [toggleCalculo, setToggleCalculo] = useState<boolean>(true);
    const [valorTotalFinal, setValorTotalFinal] = useState<number>(0);
    const [valorTotalInvestido, setValorTotalInvestido] = useState<number>(0);
    const [valorTotalJuros, setValorTotalJuros] = useState<number>(0);
    const [valorSerie, setValorSerie] = useState<number[]>([]);
    const [jurosSerieAcumulado, setJurosSerieAcumulado] = useState<number[]>([]);
    const [jurosSeriePeriodo, setJurosSeriePeriodo] = useState<number[]>([])

    const [dadosCalculo, setDadosCalculo] = useState([
        {
            label: 'Aporte Inicial',
            value: '0'
        },
        {
            label: 'Valor Mensal',
            value: '0'
        },
        {
            label: 'Taxa de Juros',
            value: '0'
        },
        {
            label: 'Período em:',
            value: '0'
        },
    ])

    const { isDark } = useDarkTheme();

    const options = {
        chart: {
          type: "pie",
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          enabled: true,
        },
        legend: {
            position: 'bottom',
            labels: {
              colors: isDark ? "#FFFFFF" : "#000000"
          }
        },
        labels: ['Valor Investido', 'Total em juros'],
        responsive: [
          {
            breakpoint: 1220,
            options: {
              chart: {
                height: '100%',
                width: '100%'
              },
    
            },
          }
        ],
      }; 

    const optionsColumnChart = {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
            enabled: false
        },
        legend:{
          labels: {
            colors: isDark ? "#FFFFFF" : "#000000"
        }},
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        fill: {
          opacity: 1    
        },
        xaxis: {
            labels: {
                show: false,
            }
        },
        yaxis: {
          labels: {
            style: {
              colors: isDark ? "#FFFFFF" : "#000000"
            }
          }
        }
    };

    function cleanData(e: React.FormEvent){
        e.preventDefault();

        setJurosSerieAcumulado([])
        setJurosSeriePeriodo([])
        setValorSerie([])
        setValorTotalFinal(0)
        setValorTotalInvestido(0)
        setValorTotalJuros(0)
        setDadosCalculo([
            {
                label: 'Aporte Inicial',
                value: '0'
            },
            {
                label: 'Valor Mensal',
                value: '0'
            },
            {
                label: 'Taxa de Juros',
                value: '0'
            },
            {
                label: 'Período em:',
                value: '0'
            },
        ])
    }

    function calcularJuros(e:React.FormEvent){
        e.preventDefault();

        let valorFinal = Number(dadosCalculo[0].value) + Number(dadosCalculo[0].value)*Number(dadosCalculo[2].value)/100 + Number(dadosCalculo[1].value);
        let valorSerieAux:number[] = [];
        let jurosSerieAcumuladoAux:number[] = [];
        let jurosSeriePeriodoAux:number[] = [];
        let ultimoValor = Number(dadosCalculo[0].value) + Number(dadosCalculo[1].value);
        let ultimoJuros = Number(dadosCalculo[0].value)*Number(dadosCalculo[2].value)/100;
        valorSerieAux = [...valorSerieAux, ultimoValor];
        jurosSerieAcumuladoAux = [...jurosSerieAcumuladoAux, ultimoJuros];
        jurosSeriePeriodoAux = [...jurosSeriePeriodoAux, ultimoJuros];

        for(let i = 1; i < Number(dadosCalculo[3].value); i++){
            ultimoValor = ultimoValor + Number(dadosCalculo[1].value);
            ultimoJuros =  ultimoJuros + valorFinal*Number(dadosCalculo[2].value)/100;
            jurosSeriePeriodoAux = [...jurosSeriePeriodoAux, valorFinal*Number(dadosCalculo[2].value)/100];

            jurosSerieAcumuladoAux = [...jurosSerieAcumuladoAux, Number(ultimoJuros.toFixed(2))]
            valorFinal = valorFinal + valorFinal*Number(dadosCalculo[2].value)/100 + Number(dadosCalculo[1].value);
            valorSerieAux = [...valorSerieAux, Number(ultimoValor.toFixed(2))]
        }
        setValorTotalFinal(valorFinal);
        setValorTotalInvestido( Number(dadosCalculo[0].value) + Number(dadosCalculo[1].value)*Number(dadosCalculo[3].value))
        setValorTotalJuros(valorFinal - Number(dadosCalculo[0].value) - Number(dadosCalculo[1].value)*Number(dadosCalculo[3].value) );
        setValorSerie(valorSerieAux);
        setJurosSerieAcumulado(jurosSerieAcumuladoAux);
        setJurosSeriePeriodo(jurosSeriePeriodoAux);

    }

    return (
      <div className="flex h-[100%] w-[100%] gap-4">
        <div className="flex flex-col bg-[#FFFFFF] w-[30%] h-[100%] rounded-lg p-4 overflow-scroll no-scrollbar dark:bg-[#141414]">
          <h1 className="text-2xl font-bold text-[#0E0E19] dark:text-[#EDEEF0]">
            Calculadora de Juros Compostos
          </h1>

          <button
            className="flex bg-[#EFEFEF] mt-3 w-[100%] border-2 border-[#000000] p-3 rounded-lg justify-between items-center"
            onClick={() => setToggleCalculo(!toggleCalculo)}
          >
            <p>Meu Cálculo</p>
            <img
              src="/assets/expand-dropdown.png"
              alt="Expandir opções"
              className={`${toggleCalculo && "rotate-180"} duration-200`}
            />
          </button>

          {toggleCalculo && (
            <form 
                className="flex flex-col"
                onSubmit={(e) => {calcularJuros(e)}}>
              {dadosCalculo.map((item, index) => {
                return (
                  <div className="flex items-center justify-between py-2 px-4 rounded-lg border-b-2 border-[#000000] dark:border-[#EDEEF0]">
                    <div className="flex flex-col">
                      <label
                        className="dark:text-[#EDEEF0]"
                        htmlFor="#inputSalario"
                      >
                        {item.label}
                      </label>
                      <div className="flex gap-2">
                        {index < 2 ? (
                          <p className="font-bold text-xl dark:text-[#EDEEF0]">
                            R$
                          </p>
                        ) : (
                          index === 2 && (
                            <p className="font-bold text-xl dark:text-[#EDEEF0]">
                              %
                            </p>
                          )
                        )}
                        <input
                          className="font-bold text-xl bg-transparent outline-none dark:text-[#EDEEF0]"
                          id="inputSalario"
                          type="number"
                          value={item.value}
                          onChange={(e) => {
                            let atualData = [...dadosCalculo];
                            atualData[index] = {
                              label: item.label,
                              value: e.target.value,
                            };

                            setDadosCalculo(atualData);
                          }}
                        />
                        {
                            index === 3 &&
                            <select 
                                className="bg-[#28292B] rounded-lg text-[#EDEEF0] px-2" 
                                defaultValue={'Meses'}>
                                <option className="text-[#EDEEF0] rounded-lg" value="Meses">Meses</option>
                                <option className="text-[#EDEEF0] rounded-lg" value="Anos">Anos</option>
                            </select>
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
              
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
                        onClick={(e) => {calcularJuros(e)}}
                        >
                        <p className="text-[#FFFFFF] text-lg">Calcular</p>
                    </button>
                </div>
            </form>
          )}

          <h1 className="text-2xl font-bold text-[#0E0E19] mt-3 dark:text-[#EDEEF0]">
            Como utilizar a calculadora de juros compostos
          </h1>

          <ul className="flex flex-col mt-4 gap-2 p-2">
            <li className="dark:text-[#EDEEF0]">
              1. Preencha o campo de valor inicial;
            </li>
            <li className="dark:text-[#EDEEF0]">
              2. Preencha o campo de valor mensal (Será somado ao final de cada
              ciclo);
            </li>
            <li className="dark:text-[#EDEEF0]">
              3. Preencha a taxa de juros anual ou mensal;
            </li>
            <li className="dark:text-[#EDEEF0]">
              4. Preencha o campo período por meses ou anos;
            </li>
            <li className="dark:text-[#EDEEF0]">
              5. Clique em calcular e veja o resultado.
            </li>
          </ul>

          <p className="mt-3 p-2 dark:text-[#EDEEF0]">
            Viu como é simples? Agora é só fazer suas simulações utilizando
            nossa calculadora de juros.
          </p>
        </div>

        <div className="flex flex-col bg-[#FFFFFF] gap-3 h-[100%] w-[70%] rounded-lg overflow-scroll no-scrollbar dark:bg-[#141414]">
          <div className="flex flex-col p-4 rounded-lg gap-3 w-[100%] h-[70%] justify-between ">
            <ul className="flex gap-3">
              <li className="flex flex-col gap-2 items-center justify-center flex-1 rounded-lg bg-[#EDEEF0] p-4">
                <p className="">Valor total final</p>
                <h2 className="font-bold text-xl">
                  R$ {valorTotalFinal.toFixed(2).replace(".", ",")}
                </h2>
              </li>
              <li className="flex flex-col gap-2 items-center justify-center flex-1 rounded-lg bg-[#EDEEF0] p-4">
                <p className="">Valor total investido</p>
                <h2 className="font-bold text-xl">
                  R$ {valorTotalInvestido.toFixed(2).replace(".", ",")}
                </h2>
              </li>
              <li className="flex flex-col gap-2 items-center justify-center flex-1 rounded-lg bg-[#EDEEF0] p-4">
                <p className="">Total de juros</p>
                <h2 className="font-bold text-xl">
                  R$ {valorTotalJuros.toFixed(2).replace(".", ",")}
                </h2>
              </li>
            </ul>

            {valorSerie.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <h3 className="font-semibold text-lg dark:text-[#EDEEF0]">
                  Preencha os dados de cálculo.
                </h3>
              </div>
            ) : (
              <>
                <div>
                  <ReactApexChart
                    options={options}
                    series={[valorTotalInvestido, valorTotalJuros]}
                    type="pie"
                    height={280}
                  />
                </div>

                <div>
                  <ReactApexChart
                    options={optionsColumnChart}
                    series={[
                      { name: "Total Investido", data: valorSerie },
                      { name: "Total Juros", data: jurosSerieAcumulado },
                    ]}
                    type="bar"
                    height={280}
                  />
                </div>

                <div className="w-[100%]">
                    <table className="bg-[#fbfbfb] min-w-full table-auto text-center border-collapse border border-[#000000]">
                        <thead>
                            <tr>
                                <th className="text-lg  border-2 border-gray-400 py-2">
                                    Período
                                </th>
                                <th className="text-lg  border-2 border-gray-400 py-2">
                                    Juros
                                </th>
                                <th className="bg-[#068FF233] text-lg  border-2 border-gray-400 py-2">
                                    Total Investido
                                </th>
                                <th className="bg-[#00A74326] text-lg  border-2 border-gray-400 py-2">
                                    Total Juros
                                </th>
                                <th className="bg-[#4C4C4C33] text-lg  border-2 border-gray-400 py-2">
                                    Total Acumulado
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                valorSerie.map((value, index) => {
                                    return(
                                        <tr>
                                            <td className="text-lg  border-2 border-gray-400 py-2">{index+1}</td>
                                            <td className="text-lg  border-2 border-gray-400 py-2">{jurosSeriePeriodo[index].toFixed(2)}</td>
                                            <td className="bg-[#068FF233] text-lg  border-2 border-gray-400 py-2">{valorSerie[index].toFixed(2)}</td>
                                            <td className="bg-[#00A74326] text-lg  border-2 border-gray-400 py-2">{jurosSerieAcumulado[index].toFixed(2)}</td>
                                            <td className="bg-[#4C4C4C33] text-lg  border-2 border-gray-400 py-2">{(valorSerie[index] + jurosSerieAcumulado[index]).toFixed(2)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
              </>
            )}
          </div>

          <div className="flex-col p-4 rounded-lg gap-3 w-[100%]"></div>
        </div>
      </div>
    );
}