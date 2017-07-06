using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Rotator : MonoBehaviour
{

    void Update()
    {
        transform.Rotate(new Vector3(10 + Random.Range(5, 20), 20 + Random.Range(5, 20), 30 + Random.Range(5, 20)) * Time.deltaTime);
    }
}
