import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView, View, Text, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import moment from 'moment';
import { colors } from '../../assets/styles/colors';
import { getSalesStats } from "../../services/salesStatsService";
import { fetchSalesStatsRequest, fetchSalesStatsFailure, fetchSalesStatsSuccess } from '../../redux/actions/salesStatsActions';
import { LineChart } from 'react-native-chart-kit';
import { PieChart as SvgPieChart } from 'react-native-svg-charts';
import { G, Text as SvgText } from 'react-native-svg';

const Container = styled.View`
  flex: 1;
  padding: 20px 0 50px 0;
  background-color: #fff;
`;

const ChartTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

const PresetButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 10px;
`;

const PresetButton = styled.TouchableOpacity`
  padding: 8px 12px;
  background-color: ${({ active }) => (active ? colors.green.grass : '#eee')};
  border-radius: 5px;
`;

const PresetButtonText = styled.Text`
  color: ${({ active }) => (active ? '#fff' : '#333')};
  // color: ${({ active }) => (active ? '#fff' : colors.brown.earth)};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
`;

const screenWidth = Dimensions.get('window').width;

const ranges = {
    week: moment().subtract(7, 'days'),
    month: moment().subtract(1, 'month'),
    year: moment().subtract(1, 'year')
};

const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = Math.floor((360 / count) * i);
        colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
};

const PieLabels = ({ slices }) => (
    <G>
        {slices.map((slice, index) => {
            const { pieCentroid, data } = slice;
            return (
                <SvgText
                    key={`label-${index}`}
                    x={pieCentroid[0]}
                    y={pieCentroid[1]}
                    fill="white"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={13}
                    fontWeight="bold"
                >
                    {/*{data.percent}%*/}
                    {data.percent}
                </SvgText>
            );
        })}
    </G>
);

const SalesStatistics = () => {
    const dispatch = useDispatch();
    const salesData = useSelector((state) => state.sales.data);
    const loading = useSelector((state) => state.sales.loading);
    const error = useSelector((state) => state.sales.error);
    const addresses = useSelector((state) => state.addresses?.list || []);
    const activeAddress = addresses.find((item) => item.isActive === true);
    const farmId = activeAddress?.farmId;

    const [presetRange, setPresetRange] = useState('week');
    const [dateRange, setDateRange] = useState({
        startDate: ranges['week'].toDate(),
        endDate: new Date(),
        displayedDate: moment(),
    });

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [tempStart, setTempStart] = useState(null);

    useEffect(() => {
        if (presetRange !== 'custom') {
            setDateRange({
                startDate: ranges[presetRange].toDate(),
                endDate: new Date(),
                displayedDate: moment(),
            });
        }
    }, [presetRange]);

    useEffect(() => {
        getSalesStats(dateRange, farmId)
            .then((salesStats) => {
                dispatch(fetchSalesStatsSuccess(salesStats));
            })
            .catch((error) => {
                dispatch(fetchSalesStatsFailure(error.message));
                console.error('Ошибка при загрузке статистики:', error);
            });
    }, [dispatch, dateRange, farmId]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error loading sales data: {error}</Text>;
    // if (!salesData || salesData.length === 0) return <Text>No sales data available</Text>;

    const totalByProduct = salesData.map((product) =>
        product.sales?.reduce((sum, s) => sum + Number(s.quantity || 0), 0) || 0
    );
    const totalAll = totalByProduct.reduce((a, b) => a + b, 0);
    const dynamicColors = generateColors(salesData.length);

    return (
        <Container>
            <PresetButtonsContainer>
                {['week', 'month', 'year', 'custom'].map((range) => (
                    <PresetButton
                        key={range}
                        active={presetRange === range}
                        onPress={() => {
                            setPresetRange(range);
                            if (range === 'custom') {
                                setShowStartPicker(true);
                            }
                        }}
                    >
                        <PresetButtonText active={presetRange === range}>{range.toUpperCase()}</PresetButtonText>
                    </PresetButton>
                ))}
            </PresetButtonsContainer>

            {showStartPicker && (
                <DateTimePicker
                    value={dateRange.startDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    maximumDate={new Date()}
                    minimumDate={moment().subtract(1, 'year').toDate()}
                    onChange={(event, selectedDate) => {
                        setShowStartPicker(false);
                        if (selectedDate) {
                            setTempStart(selectedDate);
                            setShowEndPicker(true);
                        }
                    }}
                />
            )}

            {showEndPicker && (
                <DateTimePicker
                    value={dateRange.endDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    minimumDate={tempStart || moment().subtract(1, 'year').toDate()}
                    maximumDate={new Date()}
                    onChange={(event, selectedDate) => {
                        setShowEndPicker(false);
                        if (selectedDate && tempStart) {
                            setDateRange({
                                startDate: tempStart,
                                endDate: selectedDate,
                                displayedDate: moment(selectedDate),
                            });
                        }
                    }}
                />
            )}

            <Text style={{ textAlign: 'center', marginBottom: 10, fontSize: 14 }}>
                {`Selected range: ${moment(dateRange.startDate).format('YYYY-MM-DD')} to ${moment(dateRange.endDate).format('YYYY-MM-DD')}`}
            </Text>

            <ScrollView>
                {!salesData || salesData.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>No sales data available</Text>
                ) : (
                    <>
                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: colors.brown.earth }}>
                    Sales shares by product
                </Text>

                <View style={{ flexDirection: 'row', marginBottom: 30, paddingHorizontal: 10 }}>
                    <View style={{ flex: 1 }}>
                        <SvgPieChart
                            style={{ height: 220 }}
                            valueAccessor={({ item }) => item.quantity}
                            data={salesData.map((product, index) => {
                                const quantity = totalByProduct[index];
                                const percent = totalAll ? ((quantity / totalAll) * 100).toFixed(1) : 0;
                                return {
                                    key: `pie-${index}`,
                                    quantity,
                                    percent,
                                    svg: { fill: dynamicColors[index] },
                                };
                            })}
                            spacing={0}
                            outerRadius="95%"
                            innerRadius="40%"
                        >
                            <PieLabels />
                        </SvgPieChart>
                    </View>

                    <View style={{ width: 150, paddingLeft: 10, maxHeight: 220 }}>
                        <ScrollView>
                            {salesData.map((product, index) => {
                                const quantity = totalByProduct[index];
                                const percent = totalAll ? ((quantity / totalAll) * 100).toFixed(1) : 0;
                                return (
                                    <View
                                        key={`legend-${index}`}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginBottom: 6,
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 13,
                                                height: 13,
                                                backgroundColor: dynamicColors[index],
                                                marginRight: 6,
                                                borderRadius: 2,
                                            }}
                                        />
                                        <Text style={{ fontSize: 13, flexShrink: 1 }}>
                                            {`${percent}% ${product.name}`}
                                        </Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>

                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: colors.brown.earth }}>
                    Charts
                </Text>

                {salesData.map((product, index) => {
                    const chartData = (product.sales || [])
                        .map((sale) => {
                            const time = new Date(sale?.date).getTime();
                            const quantity = Number(sale?.quantity);
                            if (!Number.isFinite(time) || !Number.isFinite(quantity)) return null;
                            return { x: time, y: quantity };
                        })
                        .filter(Boolean);

                    if (chartData.length === 1) {
                        chartData.push({
                            x: chartData[0].x + 86400000,
                            y: chartData[0].y,
                        });
                    }

                    chartData.sort((a, b) => a.x - b.x);
                    const labels = chartData.map((data) => moment(data.x).format('MMM D'));
                    const dataValues = chartData.map((data) => data.y);

                    return (
                        <View key={product.productId} style={{ marginBottom: 20 }}>
                            <ChartTitle style={{ color: dynamicColors[index] }}>{product.name}</ChartTitle>
                            {chartData.length > 0 ? (
                                <LineChart
                                    data={{
                                        labels,
                                        datasets: [
                                            {
                                                data: dataValues,
                                                color: () => dynamicColors[index],
                                                strokeWidth: 2,
                                            },
                                        ],
                                    }}
                                    width={Math.max(320, screenWidth - 15)}
                                    height={200}
                                    chartConfig={{
                                        backgroundColor: '#fff',
                                        backgroundGradientFrom: '#fff',
                                        backgroundGradientTo: '#fff',
                                        decimalPlaces: 0,
                                        color: () => '#000',
                                        labelColor: () => '#000',
                                        style: { borderRadius: 16 },
                                        propsForLabels: {
                                            fontSize: 11,
                                            rotation: -30,
                                        },
                                        propsForDots: {
                                            r: '6',
                                            strokeWidth: '2',
                                            stroke: dynamicColors[index],
                                        },
                                    }}
                                    bezier
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16,
                                        marginLeft: -18,
                                    }}
                                />
                            ) : (
                                <Text style={{ textAlign: 'center' }}>No data to display</Text>
                            )}
                        </View>
                    );
                })}
                    </>
                    )}
            </ScrollView>
        </Container>
    );
};

export default SalesStatistics;