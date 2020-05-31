const bubbleSort = `function swap(arr, firstIndex, secondIndex){
    let temp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = temp;
  }
  
  function bubbleSort(arr){
  
    let len = arr.length,
        i, j, stop;
  
    for (i=0; i < len; i++){
        for (j=0, stop=len-i; j < stop; j++){
            if (arr[j] > arr[j+1]){
                swap(arr, j, j+1);
            }
        }
    }
  
    return arr;
  }`;

const selectionSort = `function selectionSort(arr){
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let min = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[min] > arr[j]) {
                min = j;
            }
        }
        if (min !== i) {
            let tmp = arr[i];
            arr[i] = arr[min];
            arr[min] = tmp;
        }
    }
    return arr;
  }`;

export const code = {
  bubbleSort: bubbleSort,
  selectionSort: selectionSort,
};

export const explanation = {
  bubbleSort: [
    'Duyệt mảng N lần (i = 0,1,..., N-1 (N = arr.length)).',
    'Lần duyệt thứ i đưa phần tử lớn thứ i về đúng vị trí N - i mảng.',
    'So sánh phần tử j hiện tại với phần tử  kế tiếp nó j+1',
    'Nếu phần thử hiện tại lớn hơn phẩn tử kế tiếp nó, đổi chỗ hai phần tử này',
    'Duyệt phần tử kế tiếp phần tử hiện tại',
  ],

  selectionSort: [
    'Duyệt mảng N lần (i = 0,1,..., N-1 (N = arr.length)).',
    'Lần duyệt thứ i đưa phần tử nhỏ thứ i về đúng vị trí i mảng. Khởi tạo min của dãy từ phần tử thứ i đến phần tử thứ N-1 là i',
    'Duyệt mảng từ phần tử  j bắt đầu từ vị trí thứ i+1 đến vị trí thứ N-1 để tìm min',
    'Nếu phần tử  j nhỏ hơn min, đặt min bằng phần tử  j',
    'Sau lần duyệt thứ i, nếu min không phải phần tử thứ i, đổi chỗ  min, i',
  ],
};
