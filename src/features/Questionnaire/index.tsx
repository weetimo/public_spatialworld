import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface AgeDataPoint {
  ageGroup: string;
  count: number;
  male: number;
  female: number;
}

const defaultAgeData: AgeDataPoint[] = [
  { ageGroup: '18-24', male: 145, female: 100, count: 245 },
  { ageGroup: '25-34', male: 184, female: 200, count: 384 },
  { ageGroup: '35-44', male: 148, female: 150, count: 298 },
  { ageGroup: '45-64', male: 226, female: 200, count: 426 },
  { ageGroup: '65+', male: 82, female: 90, count: 172 },
];

const COLORS = ['#FF0000', '#FF4D00', '#FF9900', '#FFE600', '#FFFF00'];

interface QuestionnaireProps {
  data?: AgeDataPoint[];
  onDataUpdate?: (data: AgeDataPoint[]) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ 
  data = defaultAgeData,
  onDataUpdate
}) => {
  const [chartData, setChartData] = useState<AgeDataPoint[]>(data);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('chart-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleDone = () => {
    onDataUpdate?.(chartData);
  };

  return (
    <Box sx={{ padding: '1rem', bgcolor: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton>
          <img 
            src="https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png"
            alt="URA Logo"
            style={{ height: '80px' }}
          />
        </IconButton>
        <Typography variant="h5" sx={{ ml: 2 }}>
          Public Engagement Dashboard
        </Typography>
      </Box>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Demographics
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Age and gender
      </Typography>

      <Box id="chart-container" sx={{ width: '100%', height: 400, mb: 4 }}>
        <BarChart
          width={containerWidth || 800}
          height={400}
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 100,
            bottom: 5,
          }}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="ageGroup" />
          <Tooltip />
          <Legend />
          <Bar dataKey="male" fill="#FF4B4B" name="Male" stackId="a" />
          <Bar dataKey="female" fill="#FF8042" name="Female" stackId="a" />
        </BarChart>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ flex: 1, mr: 2 }}>
          <PieChart width={containerWidth/2 || 400} height={300}>
            <Pie
              data={[
                { name: 'East', value: 39.11 },
                { name: 'West', value: 28.02 },
                { name: 'Central', value: 23.13 },
                { name: 'North', value: 2.53 },
                { name: 'Northeast', value: 2.5 }
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {defaultAgeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconSize={20}
              wrapperStyle={{
                fontSize: '20px'
              }}
              formatter={(value, entry) => (
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  color: '#000000',
                  fontSize: '20px'
                }}>
                  {value} {entry.payload?.value.toFixed(2)}%
                </span>
              )}
            />
            <Tooltip contentStyle={{ color: '#000000' }} />
          </PieChart>
          <Typography variant="subtitle1" align="center">
            Regions
          </Typography>
        </Box>

        <Box sx={{ flex: 1, ml: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Name & Email
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { name: 'Chin Wei Ming', email: 'weiming@gmail.com' },
              { name: 'Aditya Kumar', email: 'aditya@gmail.com' }
            ].map((person, index) => (
              <Box key={index}>
                <Typography variant="body1">{person.name}</Typography>
                <Typography variant="body2" color="text.secondary">{person.email}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total: 100
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={handleDone}
        >
          Done
        </Button>
      </Box>
    </Box>
  );
};

export default Questionnaire;