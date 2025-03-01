"use client"

import * as React from "react"

import Card from "../cards/Card"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {CardContent,CardDescription,CardHeader} from "@/components/ui/card"
import {ChartConfig,ChartContainer,ChartTooltip,ChartTooltipContent} from "@/components/ui/chart"

export const description = "Analisis distribucion de visitas por dia de la semana"


const chartConfig = {
    views: {
        label: "Transitos",
    },
    desktop: {
        label: "Pasajes",
        color: "#ffffff80",
    },
} satisfies ChartConfig


interface ChartData {
    date: string
    desktop: number
}
interface BarChartBigProps {
    chartData: ChartData[]
}



export function BarChartBigWeekly({ chartData }: BarChartBigProps) {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("desktop")

    const total = React.useMemo(
        () => ({
            desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
        }),
        []
    )

    return (
        <Card style={{ width: "100%", padding: "10px" }}>
            <CardHeader className="w-full flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <p style={{ fontSize: '20px', textAlign: 'left', width: '100%' }}>Distribucion Semanal</p>
                    <CardDescription>
                        Distribucion de las visitas por dia de la semana
                    </CardDescription>
                </div>
                <div className="flex">
                    {["desktop"].map((key) => {
                        const chart = key as keyof typeof chartConfig
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l  sm:border-l sm:border-t-0 sm:border-l-0 sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground rounded-[20px]">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {total[key as keyof typeof total].toLocaleString()}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>

            <CardContent className="w-full px-2 sm:p-6">

                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"

                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis

                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                return value
                            }}
                            
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px] bg-black"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return value
                                    }}
                                />
                            }
                        />
                        <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}