import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { supabase } from "../lib/supabase"; // Verify path

export function KnowledgeGraph() {
    const [data, setData] = useState({ nodes: [], links: [] });
    const [dimensions, setDimensions] = useState({ w: 800, h: 600 });

    useEffect(() => {
        // Auto-resize logic
        setDimensions({ w: window.innerWidth - 256, h: window.innerHeight - 64 });

        // Fetch Data
        async function loadData() {
            const { data: res } = await supabase.from('resources').select('*');
            if (!res) return;

            const nodes = res.map((r: any) => ({ id: r.id, ...r }));
            // Generate dummy links if 'related_ids' field exists, or logic here
            const links = res.flatMap((source: any) =>
                (source.related_ids || []).map((target: string) => ({ source: source.id, target: target }))
            );

            setData({ nodes, links } as any);
        }
        loadData();
    }, []);

    return (
        <div className="w-full h-full relative bg-[#111118] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            {data.nodes.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-10 pointer-events-none">
                    <p className="font-bold text-lg mb-1">No connections yet</p>
                    <p className="text-xs">Add resources to visualize the graph</p>
                </div>
            )}
            <ForceGraph2D
                width={dimensions.w}
                height={dimensions.h}
                graphData={data}
                backgroundColor="#111118" // <--- DARK BG FIXED
                nodeRelSize={6}
                linkColor={() => "#475569"}
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                    // 1. Color Logic
                    let color = "#A855F7"; // Default Purple (Video)
                    const t = (node.type || "").toLowerCase();
                    const n = (node.title || "").toLowerCase();

                    if (n.includes('.xlsx') || t === 'sheet') color = "#BEF264"; // Lime
                    if (n.includes('.docx') || t === 'doc') color = "#3B82F6";   // Blue
                    if (n.includes('.pdf') || t === 'pdf') color = "#EF4444";    // Red

                    // 2. Draw Node
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
                    ctx.fillStyle = color;
                    ctx.fill();

                    // 3. Draw Label (if zoomed in)
                    if (globalScale > 1.5) {
                        const label = node.title.substring(0, 15);
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'top';
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                        ctx.fillText(label, node.x, node.y + 8);
                    }
                }}
            />
        </div>
    );
}
