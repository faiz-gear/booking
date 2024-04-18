import { DatePickerWithRange } from '@/components/date-range-picker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { memo, useMemo, useState } from 'react'
import type { PropsWithChildren, FC } from 'react'
import ReactEchart from 'echarts-for-react'
import { EChartsOption } from 'echarts'
import { useUserStats } from '@/service/hooks/useUserStats'
import { DateRange } from 'react-day-picker'
import { subDays } from 'date-fns'
import { useMeetingRoomStats } from '@/service/hooks/useMeetingRoomStats'

interface IDashboardProps {}

const Dashboard: FC<PropsWithChildren<IDashboardProps>> = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  })
  const { userStats } = useUserStats({
    startTime: date?.from?.toISOString() ?? '',
    endTime: date?.to?.toISOString() ?? ''
  })
  const userStatsOption = useMemo<EChartsOption>(
    () => ({
      xAxis: {
        type: 'category',
        data: userStats?.map((item) => item.username) ?? [],
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        interval: 1,
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      series: [
        {
          data: userStats?.map((item) => item.bookingCount) ?? [],
          type: 'bar',
          itemStyle: {
            color: '#000',
            borderRadius: 5
          }
        }
      ]
    }),
    [userStats]
  )

  const { meetingRoomStats } = useMeetingRoomStats({
    startTime: date?.from?.toISOString() ?? '',
    endTime: date?.to?.toISOString() ?? ''
  })
  const meetingRoomStatsOption = useMemo<EChartsOption>(
    () => ({
      series: [
        {
          name: 'MeetingRoom Stats',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10,
            color: '#000'
          },

          labelLine: {
            show: true
          },
          label: {
            formatter: '{b}: {c} ({d}%)'
          },
          data:
            meetingRoomStats?.map((item) => ({
              name: item.meetingRoomName,
              value: Number(item.usedCount)
            })) ?? []
        }
      ]
    }),
    [meetingRoomStats]
  )

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl"> Dashboard </h1>
        <DatePickerWithRange dateValue={date} onDateValueChange={(date) => setDate(date)} />
      </div>
      <div className="flex gap-4 mt-8">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl">用户预订统计</CardTitle>
            <CardDescription>Users Booking Stats</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactEchart option={userStatsOption} />
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl">会议室预订统计</CardTitle>
            <CardDescription>MeetingRoom Booking Stats</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactEchart option={meetingRoomStatsOption} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default memo(Dashboard)
