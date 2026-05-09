import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (dateStr) =>
  format(new Date(dateStr), 'dd MMM yyyy');

export const formatDateTime = (dateStr) =>
  format(new Date(dateStr), 'dd MMM yyyy, hh:mm a');

export const timeAgo = (dateStr) =>
  formatDistanceToNow(new Date(dateStr), { addSuffix: true });