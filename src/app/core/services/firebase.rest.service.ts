import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';
import {
  ICustomer,
  ICustomersFilter,
  IFilteredCustomers,
} from '../../shared/interfaces/customer.interface';
import { db } from '../../../../config/firebase.config';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  UploadResult,
} from 'firebase/storage';
import { CustomDbCustomersService } from './custom-db-customers.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseRestService {
  private storage = getStorage();

  constructor(
    private firestore: AngularFirestore,
    private customDBCustomersServ: CustomDbCustomersService
  ) {}

  public getFilteredCustomers(
    filter?: ICustomersFilter,
    lastCustomerId?: string
  ): Observable<IFilteredCustomers> {
    return this.customDBCustomersServ.getFilteredCustomers(
      filter as any,
      lastCustomerId
    );
  }

  public customers(): Observable<ICustomer[]> {
    return this.firestore.collection<ICustomer>('customers').valueChanges();
  }

  public getCustomer(customerId: string): Observable<ICustomer> {
    const q = query(
      collection(db, 'customers'),
      where('profileImgId', '==', customerId)
    );
    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        const customer = querySnapshot.docs[0].data() as ICustomer;
        return customer;
      })
    );
  }

  public register(customerData: ICustomer): Observable<any> {
    return from<any>(
      setDoc(doc(db, 'customers', customerData.profileImgId), customerData)
    );
  }

  public getProfileImage(imageId: string): Observable<string> {
    return from(getDownloadURL(ref(this.storage, `images/${imageId}`)));
  }

  public uploadProfileImage(
    file: File,
    imageId: string
  ): Observable<UploadResult> {
    const filePath = `images/${imageId}`;

    const profilePictureRef = ref(this.storage, filePath);

    return from(uploadBytes(profilePictureRef, file));
  }

  public removeProfileImage(imageId: string): Observable<any> {
    const desertRef = ref(this.storage, `images/${imageId}`);
    return from(deleteObject(desertRef));
  }
}
