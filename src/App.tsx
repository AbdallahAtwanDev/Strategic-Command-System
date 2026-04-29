import { useMemo, useRef, useState } from 'react';
import type { DragEventHandler } from 'react';
import { Login } from './features/auth/Login';
import { Branding } from './components/Branding';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Player, SystemState } from './types';
import { Download, Plus, Trash2 } from 'lucide-react';
import { toPng } from 'html-to-image';

const initialState: SystemState = {
  teamA: { players: [], placements: {} },
  teamB: { players: [], placements: {} },
  activeTeam: 'A',
};

export default function App() {
  const [adminName, setAdminName] = useLocalStorage<string>('gov_admin_name', '');
  const [isLogged, setIsLogged] = useState(Boolean(adminName));
  const [state, setState] = useLocalStorage<SystemState>('gov_data_v1', initialState);
  const [newPlayer, setNewPlayer] = useState('');
  const [draggingPlayerId, setDraggingPlayerId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const teamKey = state.activeTeam === 'A' ? 'teamA' : 'teamB';
  const currentTeam = state[teamKey];
  const placedPlayers = useMemo(
    () => Object.values(currentTeam.placements),
    [currentTeam.placements],
  );

  const addPlayer = () => {
    const normalizedName = newPlayer.trim();
    if (normalizedName === '') return;
    const player: Player = { id: crypto.randomUUID(), name: normalizedName };

    setState({
      ...state,
      [teamKey]: { ...currentTeam, players: [...currentTeam.players, player] },
    });
    setNewPlayer('');
  };

  const removePlayer = (id: string) => {
    const placements = { ...currentTeam.placements };
    delete placements[id];

    setState({
      ...state,
      [teamKey]: {
        ...currentTeam,
        players: currentTeam.players.filter((player) => player.id !== id),
        placements,
      },
    });
  };

  const removeFromMap = (id: string) => {
    const placements = { ...currentTeam.placements };
    delete placements[id];
    setState({
      ...state,
      [teamKey]: {
        ...currentTeam,
        placements,
      },
    });
  };

  const setPlayerPosition = (id: string, x: number, y: number) => {
    const normalizedX = Math.max(2, Math.min(98, x));
    const normalizedY = Math.max(4, Math.min(96, y));

    setState({
      ...state,
      [teamKey]: {
        ...currentTeam,
        placements: {
          ...currentTeam.placements,
          [id]: { playerId: id, x: normalizedX, y: normalizedY },
        },
      },
    });
  };

  const getRelativeCoordinates = (clientX: number, clientY: number) => {
    if (!mapRef.current) return null;
    const rect = mapRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  };

  const handleDropOnMap: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const playerId = event.dataTransfer.getData('text/player-id');
    if (!playerId) return;
    const point = getRelativeCoordinates(event.clientX, event.clientY);
    if (!point) return;
    setPlayerPosition(playerId, point.x, point.y);
    setDraggingPlayerId(null);
  };

  const handleExport = async () => {
    if (!captureRef.current) return;
    setIsExporting(true);

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    try {
      const exportPixelRatio = Math.max(2, Math.min(4, window.devicePixelRatio * 2 || 2));
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: exportPixelRatio,
      });
      const link = document.createElement('a');
      link.download = `GOV-Strategy-${state.activeTeam}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  if (!isLogged) {
    return (
      <Login
        onLogin={(name) => {
          setAdminName(name);
          setIsLogged(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 text-right bg-zinc-950" dir="rtl">
      <div className="flex flex-col gap-3 p-4 mb-6 border sm:flex-row sm:items-center sm:justify-between bg-zinc-900 rounded-xl border-zinc-800">
        <div className="flex flex-col items-start gap-1">
          <Branding size="sm" />
          <span className="text-xs text-zinc-400">القائد المسؤول: {adminName}</span>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
          <button
            onClick={() => setState({ ...state, activeTeam: 'A' })}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${state.activeTeam === 'A' ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-zinc-800'}`}
          >
            فريق A
          </button>
          <button
            onClick={() => setState({ ...state, activeTeam: 'B' })}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${state.activeTeam === 'B' ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-zinc-800'}`}
          >
            فريق B
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="p-4 border lg:col-span-1 bg-zinc-900 rounded-xl border-zinc-800">
          <h3 className="flex items-center justify-between mb-4 font-bold text-yellow-400">
            قائمة اللاعبين
            <span className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-400">{currentTeam.players.length}</span>
          </h3>
          <div className="flex gap-2 mb-4">
            <input
              value={newPlayer}
              onChange={(event) => setNewPlayer(event.target.value)}
              className="flex-1 p-2 text-sm transition-all border border-transparent rounded outline-none bg-zinc-800 focus:border-yellow-400"
              placeholder="اسم اللاعب..."
            />
            <button onClick={addPlayer} className="p-2 text-black transition-colors bg-yellow-400 rounded hover:bg-yellow-500">
              <Plus size={16} />
            </button>
          </div>
          <div className="pr-1 space-y-2 overflow-auto max-h-[40vh] sm:max-h-[60vh]">
            {currentTeam.players.map((player) => (
              <div
                key={player.id}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/player-id', player.id);
                  setDraggingPlayerId(player.id);
                }}
                onDragEnd={() => setDraggingPlayerId(null)}
                className={`flex items-center justify-between p-2 transition-all border rounded bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600 ${draggingPlayerId === player.id ? 'opacity-40' : ''}`}
              >
                <span className="text-sm">{player.name}</span>
                <button onClick={() => removePlayer(player.id)} className="p-1 transition-colors text-zinc-500 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-3">
          <div ref={captureRef} className="relative p-4 border bg-zinc-900 rounded-xl border-zinc-800">
            <div
              ref={mapRef}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDropOnMap}
              className="relative overflow-hidden bg-center bg-cover border rounded-lg aspect-video border-zinc-700"
              style={{ backgroundImage: "url('/map-bg.png')" }}
            >
              <div className="absolute inset-0 pointer-events-none bg-black/20" />
              {placedPlayers.map((placement) => {
                const player = currentTeam.players.find((item) => item.id === placement.playerId);
                if (!player) return null;

                return (
                  <div
                    key={placement.playerId}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/player-id', placement.playerId);
                      setDraggingPlayerId(placement.playerId);
                    }}
                    onDragEnd={() => setDraggingPlayerId(null)}
                    className="absolute max-w-[55%] sm:max-w-[34%] px-2 py-1 text-[10px] sm:text-[11px] font-semibold leading-tight text-white border rounded group bg-zinc-900/90 border-zinc-500 cursor-move"
                    style={{
                      left: `${placement.x}%`,
                      top: `${placement.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={player.name}
                  >
                    <span className="inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap align-middle">
                      {player.name}
                    </span>
                    <button
                      onClick={() => removeFromMap(player.id)}
                      className="hidden mr-2 text-red-400 transition-colors group-hover:inline hover:text-red-300"
                      title="إزالة من الخريطة"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
              {isExporting ? (
                <div
                  className="absolute bottom-0 left-0 z-20 origin-bottom-left pointer-events-none"
                  style={{ width: '259px', height: '66px', lineHeight: '0px', letterSpacing: '-28.3px' }}
                >
                  <Branding size="xs" />
                </div>
              ) : null}
            </div>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center justify-center w-full gap-2 py-3 font-bold transition-all bg-green-600 rounded-lg hover:bg-green-700 active:scale-[0.98]"
          >
            <Download size={20} /> استخراج الخريطة النهائية
          </button>
        </div>
      </div>
    </div>
  );
}