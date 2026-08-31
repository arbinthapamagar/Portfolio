import { Boxes, Braces, ClipboardList, Cloud, Database, FileCode2, FileSignature, FileSpreadsheet,
    FileText, FolderOpen, KeyRound, Mails, Mic, Network, PackageCheck, ReceiptText, ScanEye, Shield,
    Sparkles, Theater, Upload, Users } from 'lucide-react';
import { ALIASES, MARKS } from './techMarks';

const normalise = (name) => String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const CREAM = '#f8efdc';

/**
 * Brand palettes assume a light page. Ollama, Anthropic, Express and JWT are all
 * near-black, which disappears on this background.
 *
 * The test is HSV value (the brightest channel), not luminance: a saturated red
 * like Git's #F03C2E scores low on perceptual luminance yet reads perfectly well
 * on navy, and lifting it turns it pink. Only genuinely dark marks get touched.
 */
function readableHex(hex) {
    const n = parseInt(hex, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const value = Math.max(r, g, b) / 255;

    if (value >= 0.55) return `#${hex}`;
    if (value < 0.16) return CREAM; // effectively black: no hue left to keep
    const lift = (c) => Math.round(c + (255 - c) * 0.45);
    return `#${[lift(r), lift(g), lift(b)].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

// things with no brand mark get a glyph that says what they are instead
const GLYPHS = {
    restapis: Network,
    rest: Network,
    chromadb: Database,
    chroma: Database,
    playwright: Theater,
    whisper: Mic,
    axecore: ScanEye,
    multer: Upload,
    mongooseodm: Database,
    blade: FileCode2,
    boxes: Boxes,
    braces: Braces,
    jwtauth: KeyRound,
    // simple-icons dropped the AWS marks over licensing, so these use glyphs
    awss3: Cloud,
    s3: Cloud,
    awsses: Cloud,
    ses: Cloud,
    sanctum: Shield,
    pgboss: Boxes,
    // the admin roles list office work rather than libraries, and a row of
    // identical fallback sparkles told the reader nothing
    msexcel: FileSpreadsheet,
    excel: FileSpreadsheet,
    msword: FileText,
    word: FileText,
    documentation: FileText,
    correspondence: Mails,
    recordkeeping: FolderOpen,
    filing: FolderOpen,
    tenderpreparation: ClipboardList,
    tenders: ClipboardList,
    quotations: FileSignature,
    invoicing: ReceiptText,
    reporting: FileSpreadsheet,
    reconciliation: PackageCheck,
    inventoryrecords: PackageCheck,
    vendorcoordination: Users,
};

/**
 * Renders the real brand mark in the brand's own colour when we have one, and a
 * meaning-carrying lucide glyph when the technology has no logo (REST, JWT,
 * ChromaDB…). `mono` drops the brand colour for dense contexts.
 */
export default function TechIcon({ name, className = 'h-5 w-5', mono = false }) {
    const key = normalise(name);
    const mark = MARKS[ALIASES[key] || key];

    if (mark) {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill={mono ? 'currentColor' : readableHex(mark.h)}
                role="img"
                aria-label={mark.t}
            >
                <path d={mark.p} />
            </svg>
        );
    }

    const Glyph = GLYPHS[key] || Sparkles;
    return <Glyph className={className} aria-label={name} />;
}

// exported so callers can tint a chip with the brand colour, already corrected
// for the dark background
export const brandHex = (name) => {
    const key = normalise(name);
    const mark = MARKS[ALIASES[key] || key];
    return mark ? readableHex(mark.h) : null;
};
