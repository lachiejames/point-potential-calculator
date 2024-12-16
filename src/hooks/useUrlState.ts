import { useState } from 'react';
import { Subject } from '@/types/subject';
import { encodeStateToUrl, decodeStateFromUrl } from '@/utils/url';

export const useUrlState = () => {
  const [shareUrl, setShareUrl] = useState<string>("");
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const updateShareUrl = (subjects: Subject[]) => {
    if (subjects.length > 0) {
      setShareUrl(encodeStateToUrl(subjects));
    } else {
      setShareUrl("");
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const loadStateFromUrl = (): Subject[] | null => {
    return decodeStateFromUrl(window.location.search);
  };

  return {
    shareUrl,
    showCopiedMessage,
    updateShareUrl,
    copyShareLink,
    loadStateFromUrl,
  };
}; 