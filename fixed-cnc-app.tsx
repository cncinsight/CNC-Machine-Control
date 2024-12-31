import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Utility function for time formatting
const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

// CycleControl Component
const CycleControl = ({ machineState, onStart, onPause, onStop, cycleElapsedTime, estimatedTimeRemaining }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Cycle Control</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Cycle Controls</h3>
          <div className="flex gap-4">
            <Button
              className="flex-1"
              variant={machineState.cycleStatus === 'RUNNING' ? 'secondary' : 'default'}
              onClick={onStart}
              disabled={machineState.status === 'E-STOP' || machineState.cycleStatus === 'RUNNING'}
            >
              Cycle Start
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={onPause}
              disabled={machineState.cycleStatus !== 'RUNNING'}
            >
              Pause
            </Button>
            <Button
              className="flex-1"
              variant="destructive"
              onClick={onStop}
              disabled={machineState.cycleStatus === 'STOPPED'}
            >
              Stop
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Cycle Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <div className="text-lg font-bold">{machineState.cycleStatus}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-lg font-bold">{machineState.programProgress}%</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Cycle Timing</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Elapsed Time</div>
              <div className="text-lg font-bold">{formatTime(cycleElapsedTime)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Remaining Time</div>
              <div className="text-lg font-bold">{formatTime(estimatedTimeRemaining)}</div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Machine Status Component
const MachineStatus = ({ machineState }) => (
  <Card>
    <CardHeader>
      <CardTitle>Machine Status</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Temperature</div>
            <div className="text-lg font-bold">{machineState.temperature.toFixed(1)}°C</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Spindle Speed</div>
            <div className="text-lg font-bold">{machineState.spindleSpeed} RPM</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Feed Rate</div>
            <div className="text-lg font-bold">{machineState.feedRate} mm/min</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Current Tool</div>
            <div className="text-lg font-bold">T{machineState.currentTool}</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">Position</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-gray-100 rounded">
              <div className="text-xs text-gray-500">X</div>
              <div className="font-mono">{machineState.position.x.toFixed(3)}</div>
            </div>
            <div className="text-center p-2 bg-gray-100 rounded">
              <div className="text-xs text-gray-500">Y</div>
              <div className="font-mono">{machineState.position.y.toFixed(3)}</div>
            </div>
            <div className="text-center p-2 bg-gray-100 rounded">
              <div className="text-xs text-gray-500">Z</div>
              <div className="font-mono">{machineState.position.z.toFixed(3)}</div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Advanced Operations Component
const AdvancedOperations = ({ machineState, onOperationStart }) => {
  const [threadingParams, setThreadingParams] = useState({
    diameter: 10,
    pitch: 1.25,
    length: 25,
    depth: 1.0
  });

  const [pocketParams, setPocketParams] = useState({
    length: 50,
    width: 30,
    depth: 5,
    cornerRadius: 5
  });

  const [drillingParams, setDrillingParams] = useState({
    depth: 30,
    peckDepth: 5,
    retractHeight: 2,
    dwellTime: 0.5
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Advanced Operations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Threading Controls */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Threading</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Diameter"
                value={threadingParams.diameter}
                onChange={(e) => setThreadingParams(prev => ({
                  ...prev,
                  diameter: parseFloat(e.target.value)
                }))}
              />
              <Input
                type="number"
                placeholder="Pitch"
                value={threadingParams.pitch}
                onChange={(e) => setThreadingParams(prev => ({
                  ...prev,
                  pitch: parseFloat(e.target.value)
                }))}
              />
            </div>
            <Button 
              className="w-full"
              onClick={() => onOperationStart('threading', threadingParams)}
              disabled={machineState.status !== 'IDLE'}
            >
              Start Threading
            </Button>
          </div>

          {/* Pocket Milling Controls */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Pocket Milling</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Length"
                value={pocketParams.length}
                onChange={(e) => setPocketParams(prev => ({
                  ...prev,
                  length: parseFloat(e.target.value)
                }))}
              />
              <Input
                type="number"
                placeholder="Width"
                value={pocketParams.width}
                onChange={(e) => setPocketParams(prev => ({
                  ...prev,
                  width: parseFloat(e.target.value)
                }))}
              />
            </div>
            <Button 
              className="w-full"
              onClick={() => onOperationStart('pocket', pocketParams)}
              disabled={machineState.status !== 'IDLE'}
            >
              Start Pocket Milling
            </Button>
          </div>

          {/* Drilling Controls */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Drilling</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Depth"
                value={drillingParams.depth}
                onChange={(e) => setDrillingParams(prev => ({
                  ...prev,
                  depth: parseFloat(e.target.value)
                }))}
              />
              <Input
                type="number"
                placeholder="Peck Depth"
                value={drillingParams.peckDepth}
                onChange={(e) => setDrillingParams(prev => ({
                  ...prev,
                  peckDepth: parseFloat(e.target.value)
                }))}
              />
            </div>
            <Button 
              className="w-full"
              onClick={() => onOperationStart('drilling', drillingParams)}
              disabled={machineState.status !== 'IDLE'}
            >
              Start Drilling
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main App Component
const App = () => {
  const [machineState, setMachineState] = useState({
    position: { x: 0, y: 0, z: 0 },
    status: 'IDLE',
    cycleStatus: 'STOPPED',
    programCounter: 0,
    programProgress: 0,
    spindleSpeed: 0,
    feedRate: 0,
    temperature: 25.0,
    currentTool: 1,
    coolant: { flood: false, mist: false },
    chipConveyor: 'OFF',
    singleBlock: false,
    optionalStop: false,
    blockDelete: false,
    alarms: []
  });

  const [cycleStartTime, setCycleStartTime] = useState(null);
  const [cycleElapsedTime, setCycleElapsedTime] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0);
  const [error, setError] = useState(null);

  // Cycle timer effect
  useEffect(() => {
    let timer;
    if (machineState.cycleStatus === 'RUNNING') {
      timer = setInterval(() => {
        if (cycleStartTime) {
          const elapsed = Math.floor((Date.now() - cycleStartTime) / 1000);
          setCycleElapsedTime(elapsed);
          
          // Update progress
          setMachineState(prev => ({
            ...prev,
            programProgress: Math.min(100, Math.floor((elapsed / 300) * 100))
          }));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [machineState.cycleStatus, cycleStartTime]);

  // Handler functions
  const handleCycleStart = () => {
    if (machineState.status === 'E-STOP') return;
    
    setMachineState(prev => ({
      ...prev,
      cycleStatus: 'RUNNING',
      status: 'RUNNING',
      programProgress: 0
    }));
    
    setCycleStartTime(Date.now());
    setEstimatedTimeRemaining(300);
  };

  const handleCyclePause = () => {
    setMachineState(prev => ({
      ...prev,
      cycleStatus: 'PAUSED',
      status: 'IDLE'
    }));
  };

  const handleCycleStop = () => {
    setMachineState(prev => ({
      ...prev,
      cycleStatus: 'STOPPED',
      status: 'IDLE',
      programProgress: 0
    }));
    setCycleStartTime(null);
    setCycleElapsedTime(0);
  };

  const handleOperationStart = (type, params) => {
    if (machineState.status !== 'IDLE') return;
    
    const estimatedTimes = {
      threading: 180,
      pocket: 300,
      drilling: 120
    };
    
    handleCycleStart();
    setEstimatedTimeRemaining(estimatedTimes[type] || 300);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">CNC Machine Control</h1>
        <div className="flex items-center gap-4 mt-2">
          <div className={`h-3 w-3 rounded-full ${
            machineState.status === 'IDLE' ? 'bg-yellow-500' :
            machineState.status === 'RUNNING' ? 'bg-green-500' :
            machineState.status === 'E-STOP' ? 'bg-red-500' : 'bg-gray-500'
          }`} />
          <span className="font-medium">{machineState.status}</span>
          <Button 
            variant="destructive" 
            onClick={() => {
              handleCycleStop();
              setMachineState(prev => ({ ...prev, status: 'E-STOP' }));
            }}
            className="ml-auto"
          >
            EMERGENCY STOP
          </Button>
        </div>
      </div>

      <CycleControl
        machineState={machineState}
        onStart={handleCycleStart}
        onPause={handleCyclePause}
        onStop={handleCycleStop}
        cycleElapsedTime={cycleElapsedTime}
        estimatedTimeRemaining={estimatedTimeRemaining}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MachineStatus machineState={machineState} />
        <AdvancedOperations
          machineState={machineState}
          onOperationStart={handleOperationStart}
        />
      </div>
    </div>
  );
};

export default App;