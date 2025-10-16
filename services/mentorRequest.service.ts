import admin from '../firebaseAdmin';

const db = admin.firestore();
const COLLECTION = 'mentor_requests';

export class MentorRequestService {
  static async createRequest(data: any) {
    const ref = db.collection(COLLECTION).doc();
    const doc = {
      id: ref.id,
      menteeId: data.menteeId || data.userId || null,
      name: data.name || data.menteeName || '',
      email: data.email || '',
      message: data.message || data.details || '',
      background: data.background || '',
      goals: data.goals || '',
      preferredMeetingTime: data.preferredMeetingTime || '',
      expectedDuration: data.expectedDuration || '',
      status: data.status || 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      meta: data.meta || {},
    };

    await ref.set(doc);
    return { ...doc, createdAt: new Date() };
  }

  static async listRequests(limit = 100) {
    const snapshot = await db.collection(COLLECTION).orderBy('createdAt', 'desc').limit(limit).get();
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      } as any;
    });
  }

  static async getRequestById(id: string) {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
    } as any;
  }

  static async updateStatus(id: string, status: string) {
    const ref = db.collection(COLLECTION).doc(id);
    await ref.update({ status, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    const updated = await ref.get();
    const data = updated.data()!;
    return {
      id: updated.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
    } as any;
  }
}
