import { Task, Note, Priority, TaskCategory } from '../types';

export interface AIOperationResult {
  title?: string;
  content?: string;
  bulletPoints?: string[];
  tasks?: Array<{
    title: string;
    priority: Priority;
    category: TaskCategory;
    estimatedMinutes?: number;
  }>;
  explanation?: string;
  message?: string;
}

export const AIEngine = {
  // Summarize Note Content
  async summarizeNote(noteTitle: string, noteContent: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 800)); // realistic thinking latency

    const cleanText = noteContent.replace(/[#*`>-]/g, '').trim();
    if (!cleanText || cleanText.length < 20) {
      return `📌 **Summary for "${noteTitle}"**:\n• Core focus: Overview and quick notes.\n• Contains actionable pointers and reference material for everyday workflows.`;
    }

    const sentences = cleanText.split('\n').filter((s) => s.trim().length > 5);
    const points = sentences.slice(0, 3).map((s) => `• ${s.trim()}`);

    return `📌 **Executive Summary**:\n${points.join('\n')}\n\n🎯 **Key Takeaway**: High-priority focus item with immediate application for personal and team productivity.`;
  },

  // Improve Writing & Flow
  async improveWriting(text: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 850));

    if (!text.trim()) return text;

    return `✨ *Polished & Enhanced Version*:\n\n${text
      .split('\n')
      .map((line) => {
        if (line.startsWith('#')) return line;
        if (line.trim().length === 0) return '';
        return line
          .replace(/gonna/gi, 'going to')
          .replace(/wanna/gi, 'want to')
          .replace(/a lot of/gi, 'numerous')
          .replace(/very good/gi, 'exceptional')
          .replace(/need to/gi, 'must strategically');
      })
      .join('\n')}\n\n*(Refined with professional tone, clarity, and impactful phrasing)*`;
  },

  // Fix Grammar & Polish
  async fixGrammar(text: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (!text.trim()) return text;

    return text
      .replace(/\bi\b/g, 'I')
      .replace(/\s+/g, ' ')
      .replace(/([.!?])([A-Za-z])/g, '$1 $2')
      .trim();
  },

  // Generate Creative Ideas
  async generateIdeas(topic: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 900));

    return `💡 **Brainstormed Ideas & Next Horizons for "${topic || 'Productivity'}"**:\n\n` +
      `1. 🚀 **Automated Micro-Checkpoints**: Split big tasks into 15-min sprint milestones.\n` +
      `2. 🧠 **Contextual AI Triggers**: Auto-resurface this note when working on related tasks.\n` +
      `3. 📊 **Visual Heatmap Tracker**: Track energy levels vs task complexity over 14 days.\n` +
      `4. 🤝 **Collaborative Sync**: Share dynamic summary with one-click export.\n` +
      `5. ⚡ **Smart Voice Memos**: Transcribe and categorize brainstorm audio directly into tagged sub-sections.`;
  },

  // Extract actionable tasks from text
  async extractTasksFromNote(noteTitle: string, noteContent: string): Promise<Array<{
    title: string;
    priority: Priority;
    category: TaskCategory;
    estimatedMinutes: number;
  }>> {
    await new Promise((resolve) => setTimeout(resolve, 950));

    const lines = noteContent.split('\n').map((l) => l.trim()).filter(Boolean);
    const extracted: Array<{
      title: string;
      priority: Priority;
      category: TaskCategory;
      estimatedMinutes: number;
    }> = [];

    lines.forEach((line) => {
      if (line.startsWith('- [ ]') || line.startsWith('- [x]') || line.startsWith('-') || line.startsWith('•') || /^\d+\./.test(line)) {
        const cleaned = line.replace(/^[-*•\d\.\s\[\]x]+/, '').trim();
        if (cleaned.length > 4 && extracted.length < 5) {
          const isHigh = /urgent|crucial|top|priority|must|today|now/i.test(cleaned);
          extracted.push({
            title: cleaned,
            priority: isHigh ? 'high' : 'medium',
            category: 'Work',
            estimatedMinutes: 30,
          });
        }
      }
    });

    if (extracted.length === 0) {
      extracted.push(
        { title: `Action item: Review & execute ${noteTitle}`, priority: 'high', category: 'Work', estimatedMinutes: 45 },
        { title: `Follow up on key points in ${noteTitle}`, priority: 'medium', category: 'Work', estimatedMinutes: 20 },
        { title: `Document next steps from ${noteTitle}`, priority: 'low', category: 'Ideas', estimatedMinutes: 15 }
      );
    }

    return extracted;
  },

  // Auto-generate Subtasks for a Task
  async generateSubtasks(taskTitle: string, category: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lower = taskTitle.toLowerCase();

    if (lower.includes('presentation') || lower.includes('deck') || lower.includes('slides')) {
      return [
        'Outline core theme & slide structure',
        'Gather research metrics and charts',
        'Design visual layout & slide typography',
        'Rehearse talk track & timing',
        'Export PDF and test projector setup',
      ];
    }

    if (lower.includes('design') || lower.includes('ui') || lower.includes('app')) {
      return [
        'Audit current component tokens & spacing',
        'Create high-fidelity wireframes in Figma',
        'Verify contrast ratios and dark mode tokens',
        'Prototype micro-interactions and transitions',
        'Review design system consistency with team',
      ];
    }

    if (lower.includes('workout') || lower.includes('cardio') || lower.includes('gym')) {
      return [
        '5-minute dynamic warm-up and stretching',
        '20-minute core focus routine',
        'High intensity interval sprint',
        'Hydration & 5-minute cool down',
      ];
    }

    if (lower.includes('grocery') || lower.includes('meal') || lower.includes('food')) {
      return [
        'Check pantry for staples and spices',
        'Pick up fresh vegetables & organic fruits',
        'Source quality protein & dairy/alternatives',
        'Prep ingredients into storage containers',
      ];
    }

    if (lower.includes('review') || lower.includes('audit') || lower.includes('budget')) {
      return [
        'Collect all relevant statements & documents',
        'Identify key discrepancies and top 3 priorities',
        'Draft actionable recommendations',
        'Share summary brief with stakeholders',
      ];
    }

    return [
      `Define initial requirements for "${taskTitle}"`,
      `Block focused 30-minute deep work session`,
      `Execute primary deliverable`,
      `Review output against quality checklist`,
      `Mark complete & log progress in LifeFlow`,
    ];
  },

  // Context-aware Assistant Chat
  async generateChatResponse(
    userMessage: string,
    context: {
      tasks: Task[];
      notes: Note[];
      userName: string;
    }
  ): Promise<{
    text: string;
    actionType?: 'task_created' | 'note_created' | 'schedule_optimized' | 'summary_generated';
    actionPayload?: any;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const q = userMessage.toLowerCase().trim();
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = context.tasks.filter((t) => t.dueDate === today);
    const completedTasks = todayTasks.filter((t) => t.completed);
    const pendingTasks = todayTasks.filter((t) => !t.completed);
    const highPriorityTasks = pendingTasks.filter((t) => t.priority === 'high');

    // 1. Plan my day
    if (q.includes('plan my day') || q.includes('plan today') || q.includes('schedule today') || q.includes('my schedule')) {
      return {
        text: `🌅 **Personalized Daily Game Plan for ${context.userName}**:\n\n` +
          `📊 **Status**: ${completedTasks.length} of ${todayTasks.length} tasks completed (${pendingTasks.length} pending).\n\n` +
          `☀️ **Morning (Deep Work Block)**:\n` +
          (completedTasks.length > 0
            ? `• ✅ Completed: ${completedTasks.map((t) => t.title).join(', ')}\n`
            : `• 🎯 Focus: ${todayTasks[0]?.title || 'Review daily priorities'}\n`) +
          `\n🌤️ **Afternoon (High-Impact Tasks)**:\n` +
          (highPriorityTasks.length > 0
            ? `• 🔴 Priority: **${highPriorityTasks[0].title}** (${highPriorityTasks[0].dueTime || '3:00 PM'})\n`
            : `• ⚡ Focus: ${pendingTasks[0]?.title || 'Execute core tasks'}\n`) +
          `\n🌙 **Evening (Wrap-up & Wellness)**:\n` +
          `• 🧘 Complete personal wellness items & log tomorrow's top 3 intentions.\n\n` +
          `💡 *Tip: Would you like me to optimize this plan automatically on your Daily Planner screen?*`,
        actionType: 'schedule_optimized',
      };
    }

    // 2. Summarize notes
    if (q.includes('summarize my notes') || q.includes('summarize notes') || q.includes('recent notes')) {
      const topNotes = context.notes.slice(0, 3);
      const noteSummary = topNotes
        .map((n) => `📝 **${n.title}** (${n.category})\n  *${n.summary || n.content.slice(0, 70)}...*`)
        .join('\n\n');

      return {
        text: `📑 **Digest of Your Recent Notes** (${context.notes.length} total notes):\n\n${noteSummary}\n\n✨ *You have ${context.notes.filter((n) => n.pinned).length} pinned notes and ${context.notes.filter((n) => n.favorite).length} favorites. Would you like me to turn any of these into a checklist?*`,
        actionType: 'summary_generated',
      };
    }

    // 3. Priorities / Highest tasks
    if (q.includes('priority') || q.includes('highest') || q.includes('what to do next') || q.includes('what should i do')) {
      if (pendingTasks.length === 0) {
        return {
          text: `🎉 **Fantastic work, ${context.userName}!** All of today's tasks are completed.\n\nYou have accomplished a 100% completion rate today. You can relax, explore ideas in your Notes, or plan ahead for tomorrow.`,
        };
      }

      const topTask = highPriorityTasks[0] || pendingTasks[0];
      return {
        text: `🎯 **Your #1 Next Priority**:\n\n` +
          `📌 **${topTask.title}**\n` +
          `• **Category**: ${topTask.category}\n` +
          `• **Due Time**: ${topTask.dueTime || 'Flexible today'}\n` +
          `• **Subtasks**: ${topTask.subtasks.filter((s) => s.completed).length}/${topTask.subtasks.length} done\n\n` +
          `⚡ **Recommended Strategy**: Set a 25-minute Pomodoro timer, mute notifications, and tackle the first subtask immediately.`,
      };
    }

    // 4. Create task from chat
    if (q.startsWith('add task') || q.startsWith('create task') || q.startsWith('remind me to') || q.includes('add a task to')) {
      const taskTitle = userMessage
        .replace(/^(add task|create task|remind me to|add a task to)\s*/i, '')
        .trim();
      const cleanTitle = taskTitle || 'New actionable priority';

      return {
        text: `✅ **Task Created Successfully!**\n\nI've added **"${cleanTitle}"** to your To-Do list for Today.\n\n• **Priority**: High\n• **Category**: Work\n• **Scheduled**: Today, 4:00 PM\n\nWould you like me to break it down into subtasks?`,
        actionType: 'task_created',
        actionPayload: {
          title: cleanTitle,
          dueDate: today,
          dueTime: '04:00 PM',
          priority: 'high',
          category: 'Work',
        },
      };
    }

    // 5. Brainstorm / Ideas
    if (q.includes('brainstorm') || q.includes('idea') || q.includes('inspire') || q.includes('creativity')) {
      return {
        text: `💡 **AI Brainstorming Session**:\n\n` +
          `Here are 4 high-leverage productivity hacks tailored to your current workflow:\n` +
          `1. ⏳ **2-Minute Rule**: If any incoming task takes under 2 minutes, clear it immediately.\n` +
          `2. 🎯 **Single-Task Batching**: Group all communication and admin tasks into a single 45-min afternoon window.\n` +
          `3. 🔋 **Energy-First Scheduling**: Schedule creative work when your focus is peak (morning) and routine tasks when energy dips.\n` +
          `4. 📝 **Evening Brain Dump**: Use LifeFlow Notes at 8:00 PM to clear all active mental tabs before sleeping.\n\n` +
          `Would you like to save this directly as a new Note?`,
      };
    }

    // Default intelligent conversational response
    return {
      text: `🤖 **LifeFlow AI Assistant**:\n\nI analyzed your workspace: you have **${pendingTasks.length} pending tasks** today and **${context.notes.length} notes** in your vault.\n\nHere are some things I can do for you right now:\n` +
        `• 📅 Type *"Plan my day"* to optimize your timeline\n` +
        `• 📝 Type *"Summarize notes"* for a rapid executive digest\n` +
        `• ➕ Type *"Add task [Title]"* to instantly create a to-do\n` +
        `• 🎯 Type *"What's my top priority?"* to get focused recommendations\n` +
        `• 💡 Ask any question about your notes or time management.`,
    };
  },

  // Optimize Full Schedule
  async optimizeSchedule(tasks: Task[]): Promise<{
    morning: Task[];
    afternoon: Task[];
    evening: Task[];
    aiInsight: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const todayStr = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter((t) => t.dueDate === todayStr);

    const high = todayTasks.filter((t) => t.priority === 'high');
    const medium = todayTasks.filter((t) => t.priority === 'medium');
    const low = todayTasks.filter((t) => t.priority === 'low');

    const morning: Task[] = [];
    const afternoon: Task[] = [];
    const evening: Task[] = [];

    // Smart energy placement: high focus in morning, meetings/medium in afternoon, low/wellness in evening
    high.forEach((t, i) => {
      if (i < 2) morning.push({ ...t, scheduledTimeBlock: 'morning' });
      else afternoon.push({ ...t, scheduledTimeBlock: 'afternoon' });
    });

    medium.forEach((t, i) => {
      if (morning.length < 2) morning.push({ ...t, scheduledTimeBlock: 'morning' });
      else afternoon.push({ ...t, scheduledTimeBlock: 'afternoon' });
    });

    low.forEach((t) => {
      evening.push({ ...t, scheduledTimeBlock: 'evening' });
    });

    return {
      morning,
      afternoon,
      evening,
      aiInsight: `⚡ **AI Optimization Complete**:\n• Morning peak energy (9 AM - 12 PM) reserved for deep analytical & high-priority work.\n• Afternoon (12 PM - 5 PM) assigned for execution & collaboration.\n• Evening (5 PM - 9 PM) dedicated to personal wellness, review, and habit building.`,
    };
  },
};
