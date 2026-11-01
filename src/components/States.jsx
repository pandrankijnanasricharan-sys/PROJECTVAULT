import { AlertCircle, LoaderCircle, SearchX } from 'lucide-react';
export function Loading({ label = 'Loading projects...' }) { return <div className="state-box"><LoaderCircle className="spin" size={28}/><p>{label}</p></div>; }
export function ErrorMessage({ message }) { return message ? <div className="error-banner"><AlertCircle size={17}/>{message}</div> : null; }
export function Empty({ title = 'Nothing here yet', text = 'Try changing your search or filters.' }) { return <div className="state-box"><SearchX size={34}/><h3>{title}</h3><p>{text}</p></div>; }
