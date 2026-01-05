import { useEffect, useState, useRef, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { supabase } from "../lib/supabase"; // Verify path

export function KnowledgeGraph() {
    const [data, setData] = useState({ nodes: [], links: [] });
    const [dimensions, setDimensions] = useState({ w: 800, h: 600 });

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDimensions({ w: entry.contentRect.width, h: entry.contentRect.height });
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        async function loadData() {
            const { data: res } = await supabase.from('resources').select('*');
            if (!res) return;

            // 1. Normalize Nodes (safely handle IDs)
            const nodes = res.map((r: any) => ({
                ...r,
                id: String(r.id), // Ensure ID is a string for d3
                title: r.title || "Untitled" // Fallback title
            }));

            // 2. Create a Set of valid node IDs for O(1) lookup
            const nodeIds = new Set(nodes.map(n => n.id));

            // 3. Normalize Links & Filter Invalid Ones
            const links = res.flatMap((source: any) => {
                const sourceId = String(source.id);
                const related = source.related_ids || [];

                return related.map((targetId: any) => ({
                    source: sourceId,
                    target: String(targetId)
                }));
            }).filter(link => {
                // Only keep links where both ends exist in our node list
                // (ForceGraph crashes if it tries to link to a non-existent node)
                return nodeIds.has(link.source) && nodeIds.has(link.target);
            });

            console.log(`Graph loaded: ${nodes.length} nodes, ${links.length} links`);
            setData({ nodes, links } as any);
        }
        loadData();
    }, []);

    // Color helper
    const getNodeColor = (node: any) => {
        const t = (node.type || "").toLowerCase();
        const n = (node.title || "").toLowerCase();
        if (n.includes('.xlsx') || t === 'sheet') return "#8b7355";
        if (n.includes('.pdf') || t === 'pdf') return "#9b8b7e";
        if (n.includes('.docx') || t === 'doc') return "#a08968";
        if (t === 'video') return "#8b7355";
        if (["link", "url", "article", "website"].includes(t)) return "#9b8b7e";
        return "#a08968"; // Default
    };

    const paintLabel = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        if (globalScale > 1.2 && node && node.title) {
            const label = node.title;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#5c554b';
            ctx.fillText(label.substring(0, 15), node.x, node.y + 8);
        }
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative bg-surface-0 rounded-3xl overflow-hidden shadow-2xl border border-subtle">
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
                backgroundColor="#fefdfb" // Cream background

                // Native Rendering Props
                nodeRelSize={6}
                nodeColor={getNodeColor}

                // Links
                linkColor={() => "#dcd0c0"}
                linkWidth={2}

                // Interaction
                onNodeClick={(node: any) => {
                    if (node.url) window.open(node.url, '_blank');
                }}

                // Overlay Label
                nodeCanvasObject={paintLabel}
                nodeCanvasObjectMode={() => 'after'}

                cooldownTicks={100}
                d3VelocityDecay={0.1}
            />
        </div>
    );
}
