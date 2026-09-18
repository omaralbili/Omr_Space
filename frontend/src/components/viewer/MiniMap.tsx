interface Props {
  width: number;
  depth: number;
  playerX: number;
  playerZ: number;
}

const SIZE = 140;

export default function MiniMap({ width, depth, playerX, playerZ }: Props) {
  const px = (playerX / width) * SIZE + SIZE / 2;
  const pz = (playerZ / depth) * SIZE + SIZE / 2;

  return (
    <div
      className="absolute bottom-4 end-4 bg-white/90 rounded-xl shadow-lg border border-gray-200"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg width={SIZE} height={SIZE}>
        <rect x={4} y={4} width={SIZE - 8} height={SIZE - 8} fill="#eef0ff" stroke="#8b3fff" strokeWidth={2} />
        <circle cx={px} cy={pz} r={5} fill="#4640c9" />
      </svg>
    </div>
  );
}
